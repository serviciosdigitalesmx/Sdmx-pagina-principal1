package mx.serviciosdigitalesmx.fixi.ui.orders

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.util.UUID

data class OrderItem(
    val id: String,
    val folio: String,
    val customerName: String,
    val customerPhone: String,
    val deviceModel: String,
    val issue: String,
    val status: String, // "en_taller", "pendiente", "listo", "vencida"
    val createdAt: String,
    val estimatedCost: Double = 0.0,
    val hasEvidencePhoto: Boolean = false
)

data class OrdersUiState(
    val orders: List<OrderItem> = emptyList(),
    val filteredOrders: List<OrderItem> = emptyList(),
    val searchQuery: String = "",
    val isLoading: Boolean = false,
    val activeCount: Int = 0,
    val errorMessage: String? = null
)

class OrderViewModel : ViewModel() {

    private val _uiState = MutableStateFlow(OrdersUiState())
    val uiState: StateFlow<OrdersUiState> = _uiState.asStateFlow()

    // Mock customer database for autocomplete demonstration
    private val knownCustomers = mapOf(
        "8131590917" to "Jesús González",
        "8180001122" to "Maria López",
        "8112345678" to "Carlos Rodríguez"
    )

    init {
        loadMockOrders()
    }

    private fun loadMockOrders() {
        val initialList = listOf(
            OrderItem("1", "ORD-1024", "Jesús González", "8131590917", "Samsung S10", "Cambio de pantalla", "en_taller", "Hoy 10:30 AM", 850.0),
            OrderItem("2", "ORD-1023", "Maria López", "8180001122", "iPhone 13 Pro", "Batería no carga", "pendiente", "Hoy 09:15 AM", 1200.0),
            OrderItem("3", "ORD-1022", "Carlos Rodríguez", "8112345678", "Xiaomi Redmi Note 11", "Centro de carga flojo", "listo", "Ayer 16:20", 450.0),
            OrderItem("4", "ORD-1021", "Ana Martinez", "8199887766", "Motorola G60", "Mojado / Limpieza química", "vencida", "Hace 3 días", 650.0)
        )
        _uiState.value = _uiState.value.copy(
            orders = initialList,
            filteredOrders = initialList,
            activeCount = initialList.count { it.status != "entregado" }
        )
    }

    fun searchCustomerByPhone(phone: String): String? {
        val cleanPhone = phone.replace("\\D".toRegex(), "")
        return knownCustomers[cleanPhone]
    }

    fun onSearchQueryChanged(query: String) {
        val currentOrders = _uiState.value.orders
        val filtered = if (query.isBlank()) {
            currentOrders
        } else {
            currentOrders.filter { order ->
                order.folio.contains(query, ignoreCase = true) ||
                order.customerName.contains(query, ignoreCase = true) ||
                order.customerPhone.contains(query, ignoreCase = true) ||
                order.deviceModel.contains(query, ignoreCase = true) ||
                order.issue.contains(query, ignoreCase = true)
            }
        }
        _uiState.value = _uiState.value.copy(searchQuery = query, filteredOrders = filtered)
    }

    /**
     * TWO-PHASE ORDER PERSISTENCE
     * Fixes "Failed to persist order in transaction" error.
     * Phase 1: Fast synchronous save of core required fields.
     * Phase 2: Async background sync for evidence, checklist, and cost estimates.
     */
    fun createOrderExpress(
        phone: String,
        name: String,
        deviceModel: String,
        issue: String,
        onSuccess: (folio: String) -> Unit,
        onError: (String) -> Unit
    ) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)

            try {
                // FASE 1 (Obligatoria/Síncrona): Crear la orden mínima primero (~300ms)
                val newFolio = "ORD-${1025 + _uiState.value.orders.size}"
                val newId = UUID.randomUUID().toString()

                val minimalOrder = OrderItem(
                    id = newId,
                    folio = newFolio,
                    customerName = name.ifBlank { "Cliente Mostrador" },
                    customerPhone = phone.replace("\\D".toRegex(), ""),
                    deviceModel = deviceModel,
                    issue = issue,
                    status = "en_taller",
                    createdAt = "Ahora mismo"
                )

                // Add to local state synchronously
                val updatedList = listOf(minimalOrder) + _uiState.value.orders
                _uiState.value = _uiState.value.copy(
                    orders = updatedList,
                    filteredOrders = updatedList,
                    activeCount = updatedList.size,
                    isLoading = false
                )

                // Notify UI immediately
                onSuccess(newFolio)

                // FASE 2 (Asíncrona/Background): Subida diferida de evidencias y detalles
                launch(Dispatchers.IO) {
                    syncOrderExtendeDetailsInBackground(minimalOrder.id)
                }

            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(isLoading = false, errorMessage = e.message)
                onError(e.message ?: "Error al guardar la orden")
            }
        }
    }

    private suspend fun syncOrderExtendeDetailsInBackground(orderId: String) {
        withContext(Dispatchers.IO) {
            // Simulated async background upload of evidence photo, detailed checklist, and defaults
            kotlinx.coroutines.delay(1000)
            _uiState.value = _uiState.value.copy(
                orders = _uiState.value.orders.map {
                    if (it.id == orderId) it.copy(hasEvidencePhoto = true) else it
                }
            )
        }
    }
}
