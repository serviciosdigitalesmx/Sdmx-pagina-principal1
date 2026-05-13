import { fixService } from './services/fixService';
(function () {
    const WHATSAPP = '528117006536';
    (function redirectWithFolio() {
        const folio = new URLSearchParams(window.location.search).get('folio');
        if (!folio)
            return;
        const cleanFolio = String(folio).trim().toUpperCase();
        if (!cleanFolio)
            return;
        const target = `./portal-cliente.html?folio=${encodeURIComponent(cleanFolio)}`;
        if (window.location.pathname.endsWith('portal-cliente.html'))
            return;
        window.location.replace(target);
    })();
    function normalizarTelefono10(raw) {
        const digits = String(raw || '').replace(/\D/g, '');
        return digits.length === 10 ? digits : '';
    }
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (!navbar)
            return;
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(30, 30, 30, 0.98)';
            navbar.style.padding = '0.8rem 5%';
        }
        else {
            navbar.style.background = 'rgba(30, 30, 30, 0.95)';
            navbar.style.padding = '1rem 5%';
        }
    });
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    // Service card selection
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', function () {
            document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            const servicio = this.dataset.servicio || '';
            const input = document.getElementById('servicioInput');
            if (input)
                input.value = servicio;
            const select = document.getElementById('dispositivoSelect');
            if (select) {
                const options = Array.from(select.options);
                const option = options.find(opt => opt.value === servicio);
                if (option)
                    select.value = servicio;
            }
            document.querySelector('.form-container')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
    // Urgencia buttons
    document.querySelectorAll('.urgencia-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.urgencia-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const input = document.getElementById('urgenciaInput');
            if (input)
                input.value = this.dataset.value || 'alta';
        });
    });
    // Form submission
    const form = document.getElementById('cotizadorForm');
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            try {
                const servicioSeleccionado = document.querySelector('.service-card.selected');
                const dispositivoSelect = document.getElementById('dispositivoSelect').value;
                if (!servicioSeleccionado && !dispositivoSelect) {
                    alert('Por favor selecciona un tipo de servicio.');
                    return;
                }
                const nombre = document.querySelector('input[name="nombre"]').value.trim();
                const telefonoInput = document.querySelector('input[name="telefono"]');
                const telefono = normalizarTelefono10(telefonoInput.value.trim());
                const dispositivo = dispositivoSelect || (servicioSeleccionado ? servicioSeleccionado.dataset.servicio : 'No especificado');
                const modelo = document.querySelector('input[name="modelo"]').value.trim();
                const descripcion = document.querySelector('textarea[name="descripcion"]').value.trim();
                const urgencia = document.getElementById('urgenciaInput').value;
                const email = document.querySelector('input[name="email"]')?.value.trim() || '';
                if (!telefono) {
                    alert('El teléfono debe tener exactamente 10 dígitos.');
                    return;
                }
                const problemas = [];
                document.querySelectorAll('input[name="problemas"]:checked').forEach(cb => {
                    const label = document.querySelector(`label[for="${cb.id}"]`);
                    problemas.push(label ? label.innerText.trim() : cb.value);
                });
                let urgenciaTexto = '';
                if (urgencia === 'baja')
                    urgenciaTexto = 'Baja (esta semana)';
                else if (urgencia === 'media')
                    urgenciaTexto = 'Media (en 2-3 días)';
                else
                    urgenciaTexto = 'Alta (urgente, 24h)';
                // Uso exclusivo de fixService
                const result = await fixService.crearSolicitud({
                    nombre,
                    telefono,
                    email,
                    dispositivo,
                    modelo,
                    problemas,
                    descripcion,
                    urgencia,
                    solicitud_origen_ip: '0.0.0.0'
                });
                // WhatsApp
                let mensaje = "*Nueva cotización - SrFix Oficial*\n\n";
                mensaje += `*Folio:* ${result.data?.folio_cotizacion || 'N/A'}\n`;
                mensaje += `*Nombre:* ${nombre}\n`;
                mensaje += `*Teléfono:* ${telefono}\n`;
                mensaje += `*Dispositivo:* ${dispositivo}\n`;
                mensaje += `*Modelo:* ${modelo}\n`;
                mensaje += `*Urgencia:* ${urgenciaTexto}\n`;
                const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
                window.open(url, '_blank');
                this.reset();
                alert(`Solicitud guardada. Redirigiendo a WhatsApp...`);
            }
            catch (error) {
                console.error('Error:', error);
                alert('No se pudo procesar la solicitud: ' + error.message);
            }
        });
    }
    // Actualizar año en copyright
    const copyright = document.querySelector('.copyright');
    if (copyright) {
        copyright.innerHTML = `© ${new Date().getFullYear()} SrFix Oficial. Todos los derechos reservados.<br>
                               Especialistas en reparación de electrónicos en Monterrey, N.L.`;
    }
})();
