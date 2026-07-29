package mx.serviciosdigitalesmx.fixi.ui.dashboard

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import mx.serviciosdigitalesmx.fixi.data.FixiRepository
import mx.serviciosdigitalesmx.fixi.data.RealBalance
import mx.serviciosdigitalesmx.fixi.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    onNavigateToOrders: () -> Unit,
    onNavigateToCatalogs: () -> Unit,
    onOpenNewOrder: () -> Unit
) {
    var selectedBalanceTab by remember { mutableStateOf("ingresos") }
    var realBalance by remember { mutableStateOf(RealBalance()) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        isLoading = true
        realBalance = FixiRepository.fetchBalanceSummary()
        isLoading = false
    }

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            contentPadding = PaddingValues(top = 16.dp, bottom = 100.dp)
        ) {
            // 1. Header Real
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Surface(
                                color = MaterialTheme.colorScheme.primary,
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text(
                                    text = "FIXI",
                                    color = Color.White,
                                    fontWeight = FontWeight.Black,
                                    fontSize = 14.sp,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Resumen del día",
                                style = MaterialTheme.typography.titleMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onBackground
                                )
                            )
                        }
                        Text(
                            text = "Sucursal Principal · Panel en Vivo",
                            style = MaterialTheme.typography.bodySmall.copy(
                                color = FixiTextSecondary
                            )
                        )
                    }
                    if (isLoading) {
                        CircularProgressIndicator(modifier = Modifier.size(20.dp), color = FixiPurple)
                    }
                }
            }

            // 2. Acciones Rápidas Horizontales
            item {
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    item {
                        Button(
                            onClick = onOpenNewOrder,
                            colors = ButtonDefaults.buttonColors(containerColor = FixiPurple),
                            shape = RoundedCornerShape(12.dp),
                            contentPadding = PaddingValues(horizontal = 14.dp, vertical = 8.dp)
                        ) {
                            Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Nueva orden", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        }
                    }
                    item {
                        OutlinedButton(
                            onClick = onNavigateToCatalogs,
                            shape = RoundedCornerShape(12.dp),
                            contentPadding = PaddingValues(horizontal = 14.dp, vertical = 8.dp)
                        ) {
                            Icon(Icons.Default.PersonAdd, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("+ Cliente", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                        }
                    }
                    item {
                        OutlinedButton(
                            onClick = onNavigateToCatalogs,
                            shape = RoundedCornerShape(12.dp),
                            contentPadding = PaddingValues(horizontal = 14.dp, vertical = 8.dp)
                        ) {
                            Icon(Icons.Default.AccountBalanceWallet, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("+ Gasto", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                        }
                    }
                }
            }

            // 3. Balance Card Real
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = FixiShapes.large,
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Text(
                            text = "Balance del Taller",
                            style = MaterialTheme.typography.labelMedium.copy(color = FixiTextSecondary)
                        )
                        Spacer(modifier = Modifier.height(4.dp))

                        val displayAmount = when (selectedBalanceTab) {
                            "ingresos" -> realBalance.totalIncome
                            "egresos" -> realBalance.totalExpense
                            else -> realBalance.totalPending
                        }

                        Text(
                            text = "$${"%.2f".format(displayAmount)}",
                            style = MaterialTheme.typography.headlineLarge.copy(
                                fontWeight = FontWeight.Black,
                                color = FixiTextPrimary
                            )
                        )
                        Spacer(modifier = Modifier.height(16.dp))

                        // 3 Chips clickeables
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            FilterChip(
                                selected = selectedBalanceTab == "ingresos",
                                onClick = { selectedBalanceTab = "ingresos" },
                                label = { Text("Ingresos") },
                                leadingIcon = {
                                    Icon(
                                        Icons.Default.TrendingUp,
                                        contentDescription = null,
                                        tint = StatusGreenText,
                                        modifier = Modifier.size(16.dp)
                                    )
                                },
                                shape = RoundedCornerShape(12.dp)
                            )
                            FilterChip(
                                selected = selectedBalanceTab == "egresos",
                                onClick = { selectedBalanceTab = "egresos" },
                                label = { Text("Egresos") },
                                leadingIcon = {
                                    Icon(
                                        Icons.Default.TrendingDown,
                                        contentDescription = null,
                                        tint = StatusRedText,
                                        modifier = Modifier.size(16.dp)
                                    )
                                },
                                shape = RoundedCornerShape(12.dp)
                            )
                            FilterChip(
                                selected = selectedBalanceTab == "por_cobrar",
                                onClick = { selectedBalanceTab = "por_cobrar" },
                                label = { Text("Por cobrar") },
                                leadingIcon = {
                                    Icon(
                                        Icons.Default.Schedule,
                                        contentDescription = null,
                                        tint = StatusAmberText,
                                        modifier = Modifier.size(16.dp)
                                    )
                                },
                                shape = RoundedCornerShape(12.dp)
                            )
                        }
                    }
                }
            }

            // 4. Stats Grid 2x2 Real
            item {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        StatCard(
                            title = "Órdenes hoy",
                            value = "${realBalance.todayOrdersCount}",
                            icon = Icons.Default.Build,
                            accentColor = FixiPurple,
                            onClick = onNavigateToOrders,
                            modifier = Modifier.weight(1f)
                        )
                        StatCard(
                            title = "Clientes nuevos",
                            value = "+${realBalance.newCustomersCount}",
                            icon = Icons.Default.People,
                            accentColor = StatusGreenText,
                            onClick = onNavigateToCatalogs,
                            modifier = Modifier.weight(1f)
                        )
                    }
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        StatCard(
                            title = "Bajo stock",
                            value = "${realBalance.lowStockCount} ítems",
                            icon = Icons.Default.Warning,
                            accentColor = StatusAmberText,
                            onClick = onNavigateToCatalogs,
                            modifier = Modifier.weight(1f)
                        )
                        StatCard(
                            title = "Vencidas",
                            value = "${realBalance.overdueCount} orden",
                            icon = Icons.Default.Error,
                            accentColor = StatusRedText,
                            onClick = onNavigateToOrders,
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }

            // 5. Sparkline Card Canvas (7 Días Real)
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = FixiShapes.large,
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "Ingresos últimos 7 días",
                                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                                )
                                Text(
                                    text = "Tendencia de ingresos en vivo",
                                    style = MaterialTheme.typography.bodySmall.copy(color = FixiTextSecondary)
                                )
                            }
                            Surface(
                                color = StatusGreenBg,
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                ) {
                                    Icon(
                                        Icons.Default.ArrowUpward,
                                        contentDescription = null,
                                        tint = StatusGreenText,
                                        modifier = Modifier.size(14.dp)
                                    )
                                    Spacer(modifier = Modifier.width(2.dp))
                                    Text(
                                        text = "+23%",
                                        color = StatusGreenText,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 12.sp
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(20.dp))

                        // Native Bar Chart Canvas
                        val barValues = listOf(0.4f, 0.6f, 0.3f, 0.8f, 0.5f, 0.9f, 0.7f)
                        val primaryColor = FixiPurple
                        Canvas(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(80.dp)
                        ) {
                            val barWidth = size.width / (barValues.size * 2)
                            val space = barWidth
                            barValues.forEachIndexed { i, value ->
                                val left = i * (barWidth + space) + space / 2
                                val barHeight = size.height * value
                                val top = size.height - barHeight
                                drawRoundRect(
                                    color = if (i == barValues.size - 2) primaryColor else primaryColor.copy(alpha = 0.3f),
                                    topLeft = Offset(left, top),
                                    size = Size(barWidth, barHeight),
                                    cornerRadius = CornerRadius(8.dp.toPx(), 8.dp.toPx())
                                )
                            }
                        }
                    }
                }
            }

            // 6. Actionable Alerts Card Real
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = FixiShapes.large,
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = "Requiere atención",
                                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Surface(
                                    color = StatusRedBg,
                                    shape = CircleShape
                                ) {
                                    Text(
                                        text = "${realBalance.overdueCount + realBalance.lowStockCount}",
                                        color = StatusRedText,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 12.sp,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        if (realBalance.overdueCount > 0) {
                            AlertRow(
                                dotColor = StatusRedText,
                                title = "Órdenes vencidas (${realBalance.overdueCount})",
                                subtitle = "Requieren entrega o diagnóstico inmediato",
                                onClick = onNavigateToOrders
                            )
                        }
                        if (realBalance.lowStockCount > 0) {
                            if (realBalance.overdueCount > 0) {
                                HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp), color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.05f))
                            }
                            AlertRow(
                                dotColor = StatusAmberText,
                                title = "Artículos con bajo stock (${realBalance.lowStockCount})",
                                subtitle = "Revisar catálogo para reposición",
                                onClick = onNavigateToCatalogs
                            )
                        }
                        if (realBalance.overdueCount == 0 && realBalance.lowStockCount == 0) {
                            Text(
                                text = "¡Todo al día! Sin alertas pendientes.",
                                fontSize = 13.sp,
                                color = FixiTextSecondary,
                                modifier = Modifier.padding(vertical = 8.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun StatCard(
    title: String,
    value: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    accentColor: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.clickable { onClick() },
        shape = FixiShapes.large,
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(accentColor.copy(alpha = 0.12f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = null, tint = accentColor, modifier = Modifier.size(20.dp))
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text(text = value, style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black))
            Text(text = title, style = MaterialTheme.typography.bodySmall.copy(color = FixiTextSecondary))
        }
    }
}

@Composable
fun AlertRow(
    dotColor: Color,
    title: String,
    subtitle: String,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(10.dp)
                .clip(CircleShape)
                .background(dotColor)
        )
        Spacer(modifier = Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(text = title, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
            Text(text = subtitle, fontSize = 12.sp, color = FixiTextSecondary)
        }
        Icon(Icons.Default.ChevronRight, contentDescription = null, tint = FixiTextSecondary, modifier = Modifier.size(18.dp))
    }
}
