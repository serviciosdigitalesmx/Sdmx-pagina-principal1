package mx.serviciosdigitalesmx.fixi.ui.catalogs

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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import mx.serviciosdigitalesmx.fixi.ui.theme.*

data class CatalogModule(
    val id: String,
    val name: String,
    val description: String,
    val icon: ImageVector,
    val badge: String? = null
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CatalogsScreen() {
    var searchQuery by remember { mutableStateOf("") }

    val allModules = listOf(
        CatalogModule("1", "Inventario", "Piezas, pantallas y stock en taller", Icons.Default.Inventory2, "48 ítems"),
        CatalogModule("2", "Proveedores", "Contactos y catálogo de mayoristas", Icons.Default.LocalShipping),
        CatalogModule("3", "Servicios y Equipos", "Marcas, modelos y fallas comunes", Icons.Default.Smartphone, "6 catálogos"),
        CatalogModule("4", "Usuarios y Permisos", "Técnicos, recepcionistas y accesos", Icons.Default.Group),
        CatalogModule("5", "Gastos y Finanzas", "Conceptos de caja y egresos recurrentes", Icons.Default.AccountBalance),
        CatalogModule("6", "Clientes", "Directorio e historial de clientes", Icons.Default.People, "128 clientes")
    )

    val filteredModules = if (searchQuery.isBlank()) {
        allModules
    } else {
        allModules.filter {
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
            Text(
                text = "Catálogos y Módulos",
                style = MaterialTheme.typography.titleLarge.copy(
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground
                )
            )
            Text(
                text = "Configuración operativa del taller",
                style = MaterialTheme.typography.bodyMedium.copy(color = FixiTextSecondary)
            )

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

            Spacer(modifier = Modifier.height(16.dp))

            // Catalog Items
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(10.dp),
                contentPadding = PaddingValues(bottom = 100.dp)
            ) {
                items(filteredModules, key = { it.id }) { item ->
                    CatalogCard(item = item)
                }
            }
        }
    }
}

@Composable
fun CatalogCard(item: CatalogModule) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { /* Navigate to specific catalog module */ },
        shape = FixiShapes.medium,
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(FixiPurple.copy(alpha = 0.1f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = item.icon,
                    contentDescription = null,
                    tint = FixiPurple,
                    modifier = Modifier.size(24.dp)
                )
            }

            Spacer(modifier = Modifier.width(14.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = item.name,
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = FixiTextPrimary
                    )
                    if (item.badge != null) {
                        Spacer(modifier = Modifier.width(8.dp))
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(MaterialTheme.colorScheme.primaryContainer)
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = item.badge,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onPrimaryContainer
                            )
                        }
                    }
                }
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = item.description,
                    fontSize = 12.sp,
                    color = FixiTextSecondary
                )
            }

            Icon(
                imageVector = Icons.Default.ChevronRight,
                contentDescription = null,
                tint = FixiTextSecondary,
                modifier = Modifier.size(20.dp)
            )
        }
    }
}
