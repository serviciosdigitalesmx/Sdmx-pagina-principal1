package mx.serviciosdigitalesmx.fixi.ui.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Shapes
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

val FixiPurple = Color(0xFF7C3AED)
val FixiPurpleDark = Color(0xFF6D28D9)
val FixiPurpleLight = Color(0xFFDDD6FE)
val FixiBackground = Color(0xFFF5F3FF)
val FixiSurface = Color(0xFFFFFFFF)
val FixiTextPrimary = Color(0xFF1E1B4B)
val FixiTextSecondary = Color(0xFF6B7280)

val StatusBlueBg = Color(0xFFDBEAFE)
val StatusBlueText = Color(0xFF2563EB)
val StatusAmberBg = Color(0xFFFEF3C7)
val StatusAmberText = Color(0xFFD97706)
val StatusGreenBg = Color(0xFFD1FAE5)
val StatusGreenText = Color(0xFF059669)
val StatusRedBg = Color(0xFFFEE2E2)
val StatusRedText = Color(0xFFDC2626)

private val LightColorScheme = lightColorScheme(
    primary = FixiPurple,
    onPrimary = Color.White,
    primaryContainer = FixiPurpleLight,
    onPrimaryContainer = FixiPurpleDark,
    background = FixiBackground,
    onBackground = FixiTextPrimary,
    surface = FixiSurface,
    onSurface = FixiTextPrimary
)

val FixiShapes = Shapes(
    extraSmall = RoundedCornerShape(8.dp),
    small = RoundedCornerShape(12.dp),
    medium = RoundedCornerShape(16.dp),
    large = RoundedCornerShape(20.dp),
    extraLarge = RoundedCornerShape(24.dp)
)

@Composable
fun FixiTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = LightColorScheme,
        shapes = FixiShapes,
        content = content
    )
}
