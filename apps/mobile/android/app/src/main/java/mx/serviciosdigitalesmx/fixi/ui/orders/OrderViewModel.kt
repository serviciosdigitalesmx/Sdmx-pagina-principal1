package mx.serviciosdigitalesmx.fixi.ui.orders

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import mx.serviciosdigitalesmx.fixi.data.FixiRepository
import mx.serviciosdigitalesmx.fixi.data.RealOrder

data class OrdersUiState(
    val orders: List<RealOrder> = emptyList(),
    val filteredOrders: List<RealOrder> = emptyList(),
    val searchQuery: String = "",
    val isLoading: Boolean = false,
    val activeCount: Int = 0,
    val errorMessage: String? = null
)

class OrderViewModel : ViewModel() {

    private val _uiState = MutableStateFlow(OrdersUiState())
    val uiState: StateFlow<OrdersUiState> = _uiState.asStateFlow()

    init {
        refreshOrders()
    }

    fun refreshOrders() {
        viewModelScope.launch(Dispatchers.IO) {
            _uiState.value = _uiState.value.copy(isLoading = true)
            try {
                val realOrders = FixiRepository.fetchOrders(_uiState.value.searchQuery)
                val active = realOrders.count { it.status != "entregado" && it.status != "cancelada" }
                _uiState.value = _uiState.value.copy(
                    orders = realOrders,
                    filteredOrders = realOrders,
                    activeCount = active,
                    isLoading = false,
                    errorMessage = null
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = e.message
                )
            }
        }
    }

    suspend fun searchCustomerByPhone(phone: String): String? {
        return FixiRepository.findCustomerByPhone(phone)
    }

    fun onSearchQueryChanged(query: String) {
        _uiState.value = _uiState.value.copy(searchQuery = query)
        refreshOrders()
    }

    /**
     * REAL 2-PHASE ORDER PERSISTENCE WITH SUPABASE / BACKEND API
     */
    fun createOrderExpress(
        phone: String,
        name: String,
        deviceModel: String,
        issue: String,
        onSuccess: (folio: String) -> Unit,
        onError: (String) -> Unit
    ) {
        viewModelScope.launch(Dispatchers.IO) {
            _uiState.value = _uiState.value.copy(isLoading = true)

            try {
                // FASE 1 (Síncrona): Postea la orden real a la API / BD remota
                val createdRealOrder = FixiRepository.createOrderReal(
                    phone = phone,
                    name = name,
                    deviceModel = deviceModel,
                    issue = issue
                )

                // Refresh orders from remote DB
                val updatedList = listOf(createdRealOrder) + _uiState.value.orders
                _uiState.value = _uiState.value.copy(
                    orders = updatedList,
                    filteredOrders = updatedList,
                    activeCount = updatedList.size,
                    isLoading = false
                )

                onSuccess(createdRealOrder.folio)

            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(isLoading = false, errorMessage = e.message)
                onError(e.message ?: "Error al guardar orden en el servidor")
            }
        }
    }
}
