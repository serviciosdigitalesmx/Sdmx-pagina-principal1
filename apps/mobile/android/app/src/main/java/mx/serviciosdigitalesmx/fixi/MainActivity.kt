package mx.serviciosdigitalesmx.fixi

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import mx.serviciosdigitalesmx.fixi.ui.navigation.FixiNavigationApp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            FixiNavigationApp()
        }
    }
}
