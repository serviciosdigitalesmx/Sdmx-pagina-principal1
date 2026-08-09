package mx.serviciosdigitalesmx.fixi.ui.catalogs

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import mx.serviciosdigitalesmx.fixi.data.FixiRepository
import mx.serviciosdigitalesmx.fixi.data.RealCatalog
import mx.serviciosdigitalesmx.fixi.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CatalogsScreen() {
    val context = LocalContext.current
    var searchQuery by remember { mutableStateOf("") }
    var catalogsList by remember { mutableStateOf<List<RealCatalog>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var selectedCatalog by remember { mutableStateOf<RealCatalog?>(null) }

    LaunchedEffect(Unit) {
        isLoading = true
        catalogsList = FixiRepository.fetchRealCatalogs()
        isLoading = false
    }

    val filteredModules = if (searchQuery.isBlank()) {
        catalogsList
    } else {
        catalogsList.filter {
            it.name.contains(searchQuery, ignoreCase = true) ||
            it.description.contains(searchQuery, ignoreCase = true)
        }
    }

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
                        text = "Catálogos y Módulos",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                    )
                    Text(
                        text = "Gestión nativa de inventario y catálogos",
                        style = MaterialTheme.typography.bodyMedium.copy(color = FixiTextSecondary)
                    )
                }
                if (isLoading) {
                    CircularProgressIndicator(modifier = Modifier.size(20.dp), color = FixiPurple)
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Sticky Search Bar
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("Buscar catálogo o módulo...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = { searchQuery = "" }) {
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

            // Catalog Cards
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                contentPadding = PaddingValues(bottom = 100.dp)
            ) {
                items(filteredModules) { catalog ->
                    CatalogCardItem(
                        catalog = catalog,
                        onClick = { selectedCatalog = catalog }
                    )
                }
            }
        }

        // Modal Detalle de Módulo Seleccionado
        selectedCatalog?.let { catalog ->
            CatalogDetailModal(
                catalog = catalog,
                onDismiss = { selectedCatalog = null },
                onAction = { actionName ->
                    Toast.makeText(context, "$actionName en ${catalog.name}", Toast.LENGTH_SHORT).show()
                }
            )
        }
    }
}

@Composable
fun CatalogCardItem(
    catalog: RealCatalog,
    onClick: () -> Unit
) {
    val icon = when (catalog.type.lowercase()) {
        "device_brands", "brands" -> Icons.Default.PhoneAndroid
        "device_models", "models" -> Icons.Default.Devices
        "faults", "problems" -> Icons.Default.Build
        "checklist" -> Icons.Default.Checklist
        else -> Icons.Default.Category
    }
    val color = FixiPurple

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = FixiShapes.medium,
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .background(color.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = catalog.name,
                    tint = color,
                    modifier = Modifier.size(24.dp)
                )
            }

            Spacer(modifier = Modifier.width(16.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = catalog.name,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    color = FixiTextPrimary
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = catalog.description,
                    fontSize = 12.sp,
                    color = FixiTextSecondary,
                    maxLines = 2
                )
            }

            Spacer(modifier = Modifier.width(8.dp))

            Surface(
                shape = RoundedCornerShape(12.dp),
                color = color.copy(alpha = 0.1f)
            ) {
                Text(
                    text = "${catalog.itemCount} ítems",
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                    color = color,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            Spacer(modifier = Modifier.width(4.dp))
            Icon(Icons.Default.ChevronRight, contentDescription = null, tint = FixiTextSecondary)
        }
    }
}

@Composable
fun CatalogDetailModal(
    catalog: RealCatalog,
    onDismiss: () -> Unit,
    onAction: (String) -> Unit
) {
    val icon = when (catalog.type.lowercase()) {
        "device_brands", "brands" -> Icons.Default.PhoneAndroid
        "device_models", "models" -> Icons.Default.Devices
        "faults", "problems" -> Icons.Default.Build
        "checklist" -> Icons.Default.Checklist
        else -> Icons.Default.Category
    }

    AlertDialog(
        onDismissRequest = onDismiss,
        icon = {
            Icon(icon, contentDescription = null, tint = FixiPurple, modifier = Modifier.size(36.dp))
        },
        title = {
            Text(
                text = catalog.name,
                fontWeight = FontWeight.Bold,
                fontSize = 20.sp,
                color = FixiTextPrimary
            )
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text(
                    text = catalog.description,
                    fontSize = 14.sp,
                    color = FixiTextSecondary
                )

                Divider()

                Text(
                    text = "Acciones del Módulo:",
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp,
                    color = FixiTextPrimary
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = {
                            onAction("Ver registros")
                            onDismiss()
                        },
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(containerColor = FixiPurple)
                    ) {
                        Text("Explorar (${catalog.itemCount})")
                    }

                    OutlinedButton(
                        onClick = {
                            onAction("Agregar nuevo ítem")
                            onDismiss()
                        },
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Nuevo +")
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
