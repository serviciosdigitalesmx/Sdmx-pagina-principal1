package mx.serviciosdigitalesmx.fixi.ui.bottomsheet

import android.widget.Toast
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Smartphone
import androidx.compose.material.icons.filled.Build
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import mx.serviciosdigitalesmx.fixi.ui.orders.OrderViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NewOrderBottomSheet(
    viewModel: OrderViewModel,
    onDismissRequest: () -> Unit,
    onOrderCreated: (folio: String) -> Unit
) {
    val context = LocalContext.current
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    var phone by remember { mutableStateOf("") }
    var name by remember { mutableStateOf("") }
    var deviceModel by remember { mutableStateOf("") }
    var issue by remember { mutableStateOf("") }
    var isSubmitting by remember { mutableStateOf(false) }

    // Auto-lookup customer name when phone reaches 10 digits
    LaunchedEffect(phone) {
        val cleanPhone = phone.replace("\\D".toRegex(), "")
        if (cleanPhone.length >= 10) {
            val foundName = viewModel.searchCustomerByPhone(cleanPhone)
            if (foundName != null && name.isBlank()) {
                name = foundName
                Toast.makeText(context, "Cliente encontrado: $foundName", Toast.LENGTH_SHORT).show()
            }
        }
    }

    ModalBottomSheet(
        onDismissRequest = onDismissRequest,
        sheetState = sheetState,
        containerColor = MaterialTheme.colorScheme.surface,
        tonalElevation = 8.dp
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp)
                .padding(bottom = 32.dp, top = 8.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Header
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column {
                    Text(
                        text = "Recepción Express (30-45s)",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                    )
                    Text(
                        text = "Solo 4 datos indispensables para iniciar",
                        style = MaterialTheme.typography.bodyMedium.copy(
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                        )
                    )
                }
            }

            Divider(color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.1f))

            // Campo 1: Teléfono
            OutlinedTextField(
                value = phone,
                onValueChange = { phone = it },
                label = { Text("1. Teléfono del cliente *") },
                placeholder = { Text("Ej. 8131590917") },
                leadingIcon = { Icon(Icons.Default.Phone, contentDescription = null) },
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Phone,
                    imeAction = ImeAction.Next
                ),
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                shape = MaterialTheme.shapes.medium
            )

            // Campo 2: Nombre
            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("2. Nombre completo *") },
                placeholder = { Text("Ej. Jesús González") },
                leadingIcon = { Icon(Icons.Default.Person, contentDescription = null) },
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                shape = MaterialTheme.shapes.medium
            )

            // Campo 3: Equipo
            OutlinedTextField(
                value = deviceModel,
                onValueChange = { deviceModel = it },
                label = { Text("3. Equipo *") },
                placeholder = { Text("Ej. Samsung S10, iPhone 13...") },
                leadingIcon = { Icon(Icons.Default.Smartphone, contentDescription = null) },
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                shape = MaterialTheme.shapes.medium
            )

            // Campo 4: Falla
            OutlinedTextField(
                value = issue,
                onValueChange = { issue = it },
                label = { Text("4. Falla reportada *") },
                placeholder = { Text("Ej. Pantalla estrellada, no carga...") },
                leadingIcon = { Icon(Icons.Default.Build, contentDescription = null) },
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                shape = MaterialTheme.shapes.medium
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Botón Principal Crear Orden
            Button(
                onClick = {
                    if (phone.isBlank() || name.isBlank() || deviceModel.isBlank() || issue.isBlank()) {
                        Toast.makeText(context, "Por favor completa los 4 campos requeridos.", Toast.LENGTH_SHORT).show()
                        return@Button
                    }
                    isSubmitting = true
                    viewModel.createOrderExpress(
                        phone = phone,
                        name = name,
                        deviceModel = deviceModel,
                        issue = issue,
                        onSuccess = { newFolio ->
                            isSubmitting = false
                            Toast.makeText(context, "¡Orden $newFolio creada con éxito!", Toast.LENGTH_LONG).show()
                            onDismissRequest()
                            onOrderCreated(newFolio)
                        },
                        onError = { err ->
                            isSubmitting = false
                            Toast.makeText(context, "Error: $err", Toast.LENGTH_LONG).show()
                        }
                    )
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = MaterialTheme.shapes.large,
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
                enabled = !isSubmitting
            ) {
                if (isSubmitting) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(24.dp),
                        color = MaterialTheme.colorScheme.onPrimary,
                        strokeWidth = 2.dp
                    )
                } else {
                    Icon(
                        imageVector = Icons.Default.CheckCircle,
                        contentDescription = null,
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Crear Orden",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}
