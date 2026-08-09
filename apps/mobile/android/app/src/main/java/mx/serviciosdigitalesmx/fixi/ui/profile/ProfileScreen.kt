package mx.serviciosdigitalesmx.fixi.ui.profile

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import mx.serviciosdigitalesmx.fixi.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(onLogout: () -> Unit) {
    var expressModeEnabled by remember { mutableStateOf(true) }
    var pushNotificationsEnabled by remember { mutableStateOf(true) }
    var showAdvancedInfo by remember { mutableStateOf(false) }

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
            // 1. User Header Card
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = FixiShapes.large,
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(20.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Avatar Circular
                        Box(
                            modifier = Modifier
                                .size(56.dp)
                                .clip(CircleShape)
                                .background(FixiPurple),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "J",
                                color = Color.White,
                                fontWeight = FontWeight.Black,
                                fontSize = 24.sp
                            )
                        }

                        Spacer(modifier = Modifier.width(16.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = "Jesús González",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 17.sp,
                                    color = FixiTextPrimary
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(6.dp))
                                        .background(FixiPurpleLight)
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                ) {
                                    Text(
                                        text = "OWNER",
                                        color = FixiPurpleDark,
                                        fontWeight = FontWeight.Black,
                                        fontSize = 10.sp
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "jesus@tallerfixi.com",
                                fontSize = 13.sp,
                                color = FixiTextSecondary
                            )
                            Text(
                                text = "Taller Fixi Monterrey",
                                fontSize = 12.sp,
                                color = FixiPurple,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }
            }

            // 2. Sección Preferencias
            item {
                SectionTitle("PREFERENCIAS")
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = FixiShapes.medium,
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    Column(modifier = Modifier.padding(vertical = 4.dp)) {
                        ToggleRow(
                            title = "Modo recepción express",
                            subtitle = "Oculta campos opcionales para capturar en < 45s",
                            icon = Icons.Default.Bolt,
                            checked = expressModeEnabled,
                            onCheckedChange = { expressModeEnabled = it }
                        )
                        Divider(modifier = Modifier.padding(horizontal = 16.dp), color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.05f))
                        ToggleRow(
                            title = "Notificaciones push",
                            subtitle = "Alertas de órdenes vencidas y bajo stock",
                            icon = Icons.Default.Notifications,
                            checked = pushNotificationsEnabled,
                            onCheckedChange = { pushNotificationsEnabled = it }
                        )
                    }
                }
            }

            // 3. Sección Administración
            item {
                SectionTitle("ADMINISTRACIÓN")
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = FixiShapes.medium,
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    Column(modifier = Modifier.padding(vertical = 4.dp)) {
                        ActionRow(
                            title = "Seguridad y sesiones",
                            icon = Icons.Default.Security,
                            onClick = {}
                        )
                        Divider(modifier = Modifier.padding(horizontal = 16.dp), color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.05f))
                        ActionRow(
                            title = "Usuarios y permisos",
                            icon = Icons.Default.Group,
                            onClick = {}
                        )
                        Divider(modifier = Modifier.padding(horizontal = 16.dp), color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.05f))
                        ActionRow(
                            title = "Reportes avanzados y exportación",
                            icon = Icons.Default.BarChart,
                            onClick = {}
                        )
                    }
                }
            }

            // 4. Información Avanzada Colapsable
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { showAdvancedInfo = !showAdvancedInfo },
                    shape = FixiShapes.medium,
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Información avanzada de sistema",
                                style = MaterialTheme.typography.bodyMedium.copy(
                                    fontWeight = FontWeight.SemiBold,
                                    color = FixiTextSecondary
                                )
                            )
                            Icon(
                                imageVector = if (showAdvancedInfo) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                                contentDescription = null,
                                tint = FixiTextSecondary
                            )
                        }

                        AnimatedVisibility(visible = showAdvancedInfo) {
                            Column(modifier = Modifier.padding(top = 12.dp)) {
                                Divider(color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.05f))
                                Spacer(modifier = Modifier.height(8.dp))
                                Text("Tenant ID: fixi_tn_81923847", fontSize = 11.sp, color = FixiTextSecondary)
                                Text("Versión App: 2.4.0 Native Compose", fontSize = 11.sp, color = FixiTextSecondary)
                                Text("Motor DB: PostgreSQL Remote RLS active", fontSize = 11.sp, color = FixiTextSecondary)
                            }
                        }
                    }
                }
            }

            // 5. Cerrar Sesión
            item {
                Button(
                    onClick = onLogout,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp),
                    shape = FixiShapes.medium,
                    colors = ButtonDefaults.buttonColors(containerColor = StatusRedBg)
                ) {
                    Icon(
                        imageVector = Icons.Default.Logout,
                        contentDescription = null,
                        tint = StatusRedText,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Cerrar sesión",
                        color = StatusRedText,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                }
            }
        }
    }
}

@Composable
fun SectionTitle(title: String) {
    Text(
        text = title,
        style = MaterialTheme.typography.labelSmall.copy(
            color = FixiTextSecondary,
            fontWeight = FontWeight.Bold,
            letterSpacing = 1.sp
        ),
        modifier = Modifier.padding(start = 4.dp, bottom = 4.dp)
    )
}

@Composable
fun ToggleRow(
    title: String,
    subtitle: String,
    icon: ImageVector,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(icon, contentDescription = null, tint = FixiPurple, modifier = Modifier.size(22.dp))
        Spacer(modifier = Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(text = title, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
            Text(text = subtitle, fontSize = 12.sp, color = FixiTextSecondary)
        }
        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(checkedThumbColor = Color.White, checkedTrackColor = FixiPurple)
        )
    }
}

@Composable
fun ActionRow(
    title: String,
    icon: ImageVector,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(icon, contentDescription = null, tint = FixiPurple, modifier = Modifier.size(22.dp))
        Spacer(modifier = Modifier.width(12.dp))
        Text(text = title, fontWeight = FontWeight.SemiBold, fontSize = 14.sp, modifier = Modifier.weight(1f))
        Icon(Icons.Default.ChevronRight, contentDescription = null, tint = FixiTextSecondary, modifier = Modifier.size(20.dp))
    }
}
