package mx.serviciosdigitalesmx.fixi.ui.orders

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import mx.serviciosdigitalesmx.fixi.data.RealOrder
import mx.serviciosdigitalesmx.fixi.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OrdersScreen(
    viewModel: OrderViewModel,
    onOpenNewOrder: () -> Unit
) {
    val context = LocalContext.current
    val uiState by viewModel.uiState.collectAsState()
    var selectedOrder by remember { mutableStateOf<RealOrder?>(null) }

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp)
        ) {
            Spacer(modifier = Modifier.height(16.dp))

            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Órdenes de Servicio",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                    )
                    Text(
                        text = if (uiState.isLoading) "Cargando órdenes de BD..." else "${uiState.activeCount} órdenes activas",
                        style = MaterialTheme.typography.bodyMedium.copy(color = FixiTextSecondary)
                    )
                }
                IconButton(onClick = { viewModel.refreshOrders() }) {
                    Icon(Icons.Default.Refresh, contentDescription = "Refrescar")
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Sticky Search Bar
            OutlinedTextField(
                value = uiState.searchQuery,
                onValueChange = { viewModel.onSearchQueryChanged(it) },
                placeholder = { Text("Buscar cliente, modelo, folio...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                trailingIcon = {
                    if (uiState.searchQuery.isNotEmpty()) {
                        IconButton(onClick = { viewModel.onSearchQueryChanged("") }) {
                            Icon(Icons.Default.Clear, contentDescription = null)
                        }
                    }
                },
                modifier = Modifier.fillMaxWidth(),
                shape = MaterialTheme.shapes.large,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = Color.White,
                    unfocusedContainerColor = Color.White
                ),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Lista o Estado Vacío Real
            if (uiState.isLoading && uiState.filteredOrders.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 48.dp),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = FixiPurple)
                }
            } else if (uiState.filteredOrders.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 48.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.Inbox,
                            contentDescription = null,
                            modifier = Modifier.size(64.dp),
                            tint = FixiTextSecondary.copy(alpha = 0.5f)
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = "No se encontraron órdenes",
                            fontWeight = FontWeight.SemiBold,
                            color = FixiTextSecondary
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Button(
                            onClick = onOpenNewOrder,
                            colors = ButtonDefaults.buttonColors(containerColor = FixiPurple)
                        ) {
                            Icon(Icons.Default.Add, contentDescription = null)
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Nueva Orden Express")
                        }
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    contentPadding = PaddingValues(bottom = 100.dp)
                ) {
                    items(uiState.filteredOrders) { order ->
                        OrderCardItem(
                            order = order,
                            onClick = { selectedOrder = order }
                        )
                    }
                }
            }
        }

        // Modal Detalle de la Orden Seleccionada
        selectedOrder?.let { order ->
            OrderDetailModal(
                order = order,
                onDismiss = { selectedOrder = null },
                onUpdateStatus = { newStatus ->
                    Toast.makeText(context, "Estado actualizado a: $newStatus", Toast.LENGTH_SHORT).show()
                    selectedOrder = null
                    viewModel.refreshOrders()
                }
            )
        }
    }
}

@Composable
fun OrderCardItem(
    order: RealOrder,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = FixiShapes.medium,
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = order.folio,
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    color = FixiTextPrimary
                )
                OrderStatusChip(status = order.status)
            }

            Spacer(modifier = Modifier.height(6.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    Icons.Default.Smartphone,
                    contentDescription = null,
                    modifier = Modifier.size(16.dp),
                    tint = FixiPurple
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = order.deviceModel,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 14.sp,
                    color = FixiTextPrimary
                )
            }

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "Falla: ${order.issue}",
                fontSize = 12.sp,
                color = FixiTextSecondary,
                maxLines = 1
            )

            Spacer(modifier = Modifier.height(8.dp))
            Divider(color = Color(0xFFF1F5F9))
            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        Icons.Default.Person,
                        contentDescription = null,
                        modifier = Modifier.size(14.dp),
                        tint = FixiTextSecondary
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = order.customerName,
                        fontSize = 12.sp,
                        color = FixiTextSecondary
                    )
                }

                Text(
                    text = "$${String.format("%.2f", order.estimatedCost)}",
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    color = FixiPurple
                )
            }
        }
    }
}

@Composable
fun OrderStatusChip(status: String) {
    val (label, bg, fg) = when (status.lowercase()) {
        "recibido" -> Triple("RECIBIDO", Color(0xFFEFF6FF), Color(0xFF1D4ED8))
        "en_diagnostico" -> Triple("DIAGNÓSTICO", Color(0xFFFEF3C7), Color(0xFFD97706))
        "reparado" -> Triple("REPARADO", Color(0xFFDCFCE7), Color(0xFF15803D))
        "entregado" -> Triple("ENTREGADO", Color(0xFFF3E8FF), Color(0xFF7E22CE))
        else -> Triple(status.uppercase(), Color(0xFFF1F5F9), Color(0xFF64748B))
    }

    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(6.dp))
            .background(bg)
            .padding(horizontal = 8.dp, vertical = 4.dp)
    ) {
        Text(
            text = label,
            color = fg,
            fontWeight = FontWeight.Bold,
            fontSize = 10.sp
        )
    }
}

@Composable
fun OrderDetailModal(
    order: RealOrder,
    onDismiss: () -> Unit,
    onUpdateStatus: (String) -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(order.folio, fontWeight = FontWeight.Bold)
                OrderStatusChip(status = order.status)
            }
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("Cliente: ${order.customerName}", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                Text("Teléfono: ${order.customerPhone}", fontSize = 13.sp, color = FixiTextSecondary)
                Text("Equipo: ${order.deviceModel}", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                Text("Falla: ${order.issue}", fontSize = 13.sp, color = FixiTextSecondary)
                Text("Estimado: $${String.format("%.2f", order.estimatedCost)}", fontWeight = FontWeight.Bold, color = FixiPurple, fontSize = 16.sp)

                Divider()

                Text("Cambiar Estado:", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Button(
                        onClick = { onUpdateStatus("en_diagnostico") },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD97706)),
                        contentPadding = PaddingValues(horizontal = 4.dp, vertical = 2.dp)
                    ) {
                        Text("Diagnóstico", fontSize = 11.sp)
                    }

                    Button(
                        onClick = { onUpdateStatus("reparado") },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF15803D)),
                        contentPadding = PaddingValues(horizontal = 4.dp, vertical = 2.dp)
                    ) {
                        Text("Reparado", fontSize = 11.sp)
                    }
                }
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) {
                Text("Cerrar")
            }
        }
    )
}
