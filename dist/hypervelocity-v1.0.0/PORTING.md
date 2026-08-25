# Porting Hypervelocity

## Contrato del repositorio destino

El repositorio debe ser Git y debe contener o recibir un control plane bajo
`.hypervelocity/` (configurable con `HYPERVELOCITY_CONTROL_DIR`). El motor espera las mismas
familias de archivos que la versión congelada: `ADD/specs`, `ADD/PLAN`, `REPORTS`,
`SUPERVISOR`, `ACTIVE_ASPEC`, policy, estado, resultados y logs runtime.

El mapa y las A.SPEC deben pertenecer al proyecto destino. Hypervelocity no inventa tablas,
rutas, comandos, contratos ni datos del producto.

## Dependencias de ejecución

- Python 3.10 o posterior con `multiprocessing`, `urllib`, `json` y librería estándar.
- Git.
- `rg` para las herramientas de inspección del worker.
- Shell POSIX; `bash` se usa para el worker legado opcional.
- Acceso al Keychain de macOS para las credenciales Gemini, o un adaptador equivalente fuera
  de macOS que mantenga el mismo contrato de variables y no exponga secretos.
- Acceso HTTPS al endpoint Gemini configurado por `RALPH_GEMINI_API_URL`.

Las dependencias de cada aplicación (Node, pnpm, Gradle, Maven, Docker, etc.) no forman parte
del motor: se descubren desde los manifiestos y comandos de verificación de cada A.SPEC.

## Configuración

Variables soportadas:

- `HYPERVELOCITY_REPO`: raíz absoluta del repositorio objetivo.
- `HYPERVELOCITY_PROJECT_NAME`: nombre descriptivo usado en los prompts.
- `HYPERVELOCITY_CONTROL_DIR`: directorio de control; por defecto `.hypervelocity`.
- `HYPERVELOCITY_RUNTIME_DIR`: PID, log y worktrees temporales; por defecto `~/.hypervelocity`.
- `HYPERVELOCITY_KEY_POOL_FILE`: archivo opcional con nombres de servicios Keychain.
- `RALPH_GEMINI_KEY_SERVICES`: lista separada por comas de servicios Keychain.
- `RALPH_GEMINI_API_MODEL`: modelo; esta release conserva `gemma-4-26b-a4b-it`.
- `RALPH_GEMINI_API_URL`: endpoint compatible con la API Gemini.
- `HYPERVELOCITY_LEGACY_WORKER`: worker legado opcional para el flujo no-Hypervelocity.

## Adaptadores

El adaptador del producto debe aportar únicamente contexto y A.SPEC reales. No se debe
modificar el core para agregar conocimiento de un dominio. Para un PMS, el adaptador debe
definir sus rutas permitidas, comandos verificables, contratos, dependencias, rollback y
aprobaciones HIGH/CRITICAL.

## Acoplamientos restantes

- El formato de A.SPEC y su control plane conserva la estructura de la implementación original.
- Los comandos de checkpoint se derivan de `gradlew`, `package.json` y otros manifiestos del
  repositorio destino.
- El worker Gemini requiere nombres de servicios Keychain válidos en la máquina donde se instala.
- El worker legado `ralph` solo funciona si el repositorio destino proporciona ese comando y se
  configura `HYPERVELOCITY_LEGACY_WORKER`; Hypervelocity no lo instala.
- La distribución no incluye `agy`, Codex, Node, pnpm, Gradle, Docker ni un proveedor Gemini.

## Recuperación

`source/` conserva los archivos exactos del motor original, incluido el wrapper de CLI, y
`MANIFEST.json` contiene hashes de cada archivo. El commit y el tag del repositorio permiten
recuperar esta release aunque el motor evolucione después. La instalación en otro producto debe
conservar el tag y verificar el manifest antes de iniciar.

El repositorio destino debe tener al menos un commit inicial; un repositorio Git vacío no puede
pasar el doctor porque no tiene un `HEAD` que sirva de baseline.
