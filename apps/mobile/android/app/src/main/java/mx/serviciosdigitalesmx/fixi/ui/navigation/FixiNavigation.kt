package mx.serviciosdigitalesmx.fixi.ui.navigation

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import mx.serviciosdigitalesmx.fixi.ui.bottomsheet.NewOrderBottomSheet
import mx.serviciosdigitalesmx.fixi.ui.catalogs.CatalogsScreen
import mx.serviciosdigitalesmx.fixi.ui.dashboard.DashboardScreen
import mx.serviciosdigitalesmx.fixi.ui.orders.OrderViewModel
import mx.serviciosdigitalesmx.fixi.ui.orders.OrdersScreen
import mx.serviciosdigitalesmx.fixi.ui.profile.ProfileScreen
import mx.serviciosdigitalesmx.fixi.ui.theme.FixiPurple
import mx.serviciosdigitalesmx.fixi.ui.theme.FixiTheme

sealed class BottomTab(val route: String, val title: String, val icon: ImageVector) {
    object Dashboard : BottomTab("dashboard", "Dashboard", Icons.Default.GridView)
    object Orders : BottomTab("orders", "Órdenes", Icons.Default.Assignment)
    object Catalogs : BottomTab("catalogs", "Catálogos", Icons.Default.Category)
    object Profile : BottomTab("profile", "Perfil", Icons.Default.Person)
}

@Composable
fun FixiNavigationApp(onLogout: () -> Unit = {}) {
    FixiTheme {
        val orderViewModel: OrderViewModel = viewModel()
        var currentRoute by remember { mutableStateOf(BottomTab.Dashboard.route) }
        var showNewOrderBottomSheet by remember { mutableStateOf(false) }

        Scaffold(
            bottomBar = {
                FixiBottomNavigation(
                    currentRoute = currentRoute,
                    onTabSelected = { currentRoute = it },
                    onFabClick = { showNewOrderBottomSheet = true }
                )
            }
        ) { paddingValues ->
            Box(modifier = Modifier.padding(paddingValues)) {
                when (currentRoute) {
                    BottomTab.Dashboard.route -> DashboardScreen(
                        onNavigateToOrders = { currentRoute = BottomTab.Orders.route },
                        onNavigateToCatalogs = { currentRoute = BottomTab.Catalogs.route },
                        onOpenNewOrder = { showNewOrderBottomSheet = true }
                    )
                    BottomTab.Orders.route -> OrdersScreen(
                        viewModel = orderViewModel,
                        onOpenNewOrder = { showNewOrderBottomSheet = true }
                    )
                    BottomTab.Catalogs.route -> CatalogsScreen()
                    BottomTab.Profile.route -> ProfileScreen(onLogout = onLogout)
                }
            }

            // Central FAB ModalBottomSheet opens from ANY screen
            if (showNewOrderBottomSheet) {
                NewOrderBottomSheet(
                    viewModel = orderViewModel,
                    onDismissRequest = { showNewOrderBottomSheet = false },
                    onOrderCreated = {
                        showNewOrderBottomSheet = false
                        currentRoute = BottomTab.Orders.route
                    }
                )
            }
        }
    }
}

@Composable
fun FixiBottomNavigation(
    currentRoute: String,
    onTabSelected: (String) -> Unit,
    onFabClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .wrapContentHeight(),
        contentAlignment = Alignment.BottomCenter
    ) {
        // Bottom Navigation Bar Container
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = Color.White,
            tonalElevation = 8.dp,
            shadowElevation = 12.dp
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(68.dp)
                    .padding(horizontal = 8.dp),
                horizontalArrangement = Arrangement.SpaceAround,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Tab 1: Dashboard
                NavItem(
                    tab = BottomTab.Dashboard,
                    isSelected = currentRoute == BottomTab.Dashboard.route,
                    onClick = { onTabSelected(BottomTab.Dashboard.route) }
                )

                // Tab 2: Órdenes
                NavItem(
                    tab = BottomTab.Orders,
                    isSelected = currentRoute == BottomTab.Orders.route,
                    onClick = { onTabSelected(BottomTab.Orders.route) }
                )

                // Space for FAB
                Spacer(modifier = Modifier.width(56.dp))

                // Tab 3: Catálogos
                NavItem(
                    tab = BottomTab.Catalogs,
                    isSelected = currentRoute == BottomTab.Catalogs.route,
                    onClick = { onTabSelected(BottomTab.Catalogs.route) }
                )

                // Tab 4: Perfil
                NavItem(
                    tab = BottomTab.Profile,
                    isSelected = currentRoute == BottomTab.Profile.route,
                    onClick = { onTabSelected(BottomTab.Profile.route) }
                )
            }
        }

        // Floating Action Button (FAB)
        FloatingActionButton(
            onClick = onFabClick,
            modifier = Modifier
                .align(Alignment.TopCenter)
                .offset(y = (-14).dp)
                .size(56.dp),
            shape = CircleShape,
            containerColor = FixiPurple,
            contentColor = Color.White,
            elevation = FloatingActionButtonDefaults.elevation(defaultElevation = 8.dp)
        ) {
            Icon(
                imageVector = Icons.Default.Add,
                contentDescription = "Nueva Orden",
                modifier = Modifier.size(28.dp)
            )
        }
    }
}

@Composable
fun NavItem(
    tab: BottomTab,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val iconColor = if (isSelected) FixiPurple else Color(0xFF9CA3AF)
    val textColor = if (isSelected) FixiPurple else Color(0xFF9CA3AF)

    IconButton(
        onClick = onClick,
        modifier = Modifier.width(64.dp)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = tab.icon,
                contentDescription = tab.title,
                tint = iconColor,
                modifier = Modifier.size(22.dp)
            )
            Text(
                text = tab.title,
                fontSize = 11.sp,
                color = textColor,
                style = MaterialTheme.typography.labelSmall
            )
        }
    }
}
