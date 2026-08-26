# Hypervelocity v1.0.0

Snapshot portable del motor de orquestación que coordina planner, waves, workers Gemini,
worktrees aislados, integración serializada, verificación, checkpoints y gates de aprobación.

Esta distribución no contiene código de producto, datos, secretos ni despliegue automático.
No inicia workers al instalarse.

## Contenido

- `hypervelocity/`: núcleo portable y policy congelada.
- `source/`: copia exacta del motor que originó este snapshot, conservada para recuperación.
- `config/hypervelocity.example.json`: configuración de referencia sin secretos.
- `install.sh`: instala el núcleo en otro repositorio.
- `doctor.sh`: valida sintaxis, control plane y estado Git.
- `start.sh` / `stop.sh`: inicia o detiene el supervisor del repositorio objetivo.
- `MANIFEST.json`: archivos, hashes y exclusiones del snapshot.
- `PORTING.md`: acoplamientos y requisitos para migrarlo a otro producto.

## Instalación

Desde el directorio que contiene esta distribución:

```bash
./install.sh /ruta/al/repositorio
./doctor.sh /ruta/al/repositorio
```

La instalación usa `.hypervelocity/` dentro del repositorio objetivo. Si ya existe y se desea
reemplazar explícitamente el motor y su policy:

```bash
./install.sh /ruta/al/repositorio --force
```

El repositorio destino debe tener al menos un commit inicial antes de ejecutar `doctor.sh` o
iniciar el supervisor, porque los checkpoints y el gate de integración necesitan un `HEAD` válido.

## Ejecución

```bash
./start.sh /ruta/al/repositorio "objetivo de reparación"
./stop.sh /ruta/al/repositorio
```

El motor no despliega a producción ni toca servicios remotos automáticamente.

## Credenciales

Las claves Gemini no están en este paquete. El worker las lee desde el Keychain del sistema
usando los nombres configurados en `policy.json` o `RALPH_GEMINI_KEY_SERVICES`. Nunca se deben
guardar claves en el repositorio, `.env`, logs o manifest.
