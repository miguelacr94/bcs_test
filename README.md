# BCS API - Backend Monorepo

Este repositorio contiene el backend del proyecto BCS, construido como un **monorepositorio** utilizando [NestJS](https://nestjs.com/) y una arquitectura basada en microservicios.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu máquina:
- **Node.js** (v18 o superior recomendado)
- **Docker** y **Docker Compose** (para levantar las bases de datos y caché)
- **pnpm** (o npm) como gestor de paquetes.

---

## ⚙️ Configuración Inicial

### 1. Clonar el repositorio
Si aún no lo has hecho, clona el repositorio y navega a la carpeta de la API:
```bash
cd bcs_api
```

### 2. Variables de Entorno
Asegúrate de contar con el archivo `.env` en la raíz del proyecto (`bcs_api/.env`). Este archivo debe contener como mínimo:
```env
PORT=3000
MONGO_URI_AUTH=mongodb://127.0.0.1:27017/bcs_auth_db
MONGO_URI_CUSTOMER=mongodb://127.0.0.1:27017/bcs_customer_db
MONGO_URI_APPLICATIONS=mongodb://127.0.0.1:27017/bcs_applications_db
```
*(Nota: Si las URIs apuntan a `127.0.0.1`, los microservicios deben ejecutarse localmente, fuera de los contenedores Docker, o bien ajustar la URI a `mongodb` si se ejecutan dentro).*

### 3. Instalar Dependencias
Instala todas las dependencias del monorepo utilizando tu gestor de paquetes (se recomienda `pnpm` o `npm`):
```bash
npm install
# o
pnpm install
```

---

## 🚀 Paso a Paso para Levantar la API

### Paso 1: Levantar los servicios de Infraestructura (MongoDB y Redis)
El proyecto cuenta con un archivo `docker-compose.yml` que facilita la creación de los servicios base. Para iniciar la base de datos (MongoDB) y la caché (Redis), ejecuta:
```bash
docker-compose up -d mongodb redis
```
Esto levantará:
- **MongoDB** en el puerto `27017`
- **Redis** en el puerto `6379`

### Paso 2: Ejecutar los Microservicios Localmente
El proyecto incluye un script preparado para levantar el **API Gateway** junto con todos los microservicios (`auth`, `customer`, `applications`, `user-core`, `offer-core`, `disbursements`, `tracing`) al mismo tiempo.

Ejecuta el siguiente comando en la raíz de `bcs_api`:
```bash
npm run start:all
# o
pnpm start:all
```
*Este comando se encarga automáticamente de matar procesos anteriores que se hayan quedado colgados en el puerto 3000 y levanta todos los servicios en modo de desarrollo (`--watch`).*

### Paso 3: Probar los Endpoints (REST Client)
Una vez que el API Gateway y los microservicios estén corriendo, puedes probar las peticiones directamente desde tu editor de código (se recomienda usar **VSCode** con la extensión [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)).

Cada microservicio cuenta con un archivo interactivo de pruebas ubicado en su carpeta `docs`:
1. **API Gateway / Orquestación (Validaciones):** Abre el archivo `apps/api-gateway/docs/users.http`. Allí encontrarás la petición para simular la validación de un usuario (incluyendo la regla de los 30 días).
2. **Solicitudes (Applications):** Abre el archivo `apps/applications/docs/service.http`. Allí encontrarás todo el flujo (Crear solicitud, Simular oferta, Aceptar, Abandonar, Finalizar, etc.).
3. **Autenticación (Auth):** Puedes generar tokens de prueba usando las peticiones en `apps/auth/docs/service.http`. (Recuerda copiar el token generado y pegarlo en la variable `@token` del archivo `service.http` de las solicitudes).

Simplemente abre cualquiera de esos archivos en VSCode y haz clic en el botón `Send Request` que aparece arriba de cada bloque de petición.

---

## 🐳 Alternativa: Levantar todo con Docker

Si prefieres levantar **todo el ecosistema** (Bases de datos + Microservicios) utilizando únicamente Docker, puedes hacerlo con el siguiente comando:
```bash
docker-compose up --build
```
*Nota: Ten en cuenta que si levantas los servicios de Node mediante Docker, deberás ajustar las URLs de conexión en tu `.env` para que apunten al host interno de Docker (por ejemplo, reemplazar `127.0.0.1` por `mongodb`).*

---

## 🗂️ Estructura del Monorepo

El código fuente está dividido principalmente en dos carpetas dentro de la raíz:
- **`apps/`**: Contiene el API Gateway y todos los microservicios individuales (ej. `api-gateway`, `auth`, `customer`, `applications`, etc.).
- **`libs/`**: Contiene código compartido, utilidades y librerías transversales (ej. `shared/src/tracing`).

---

## 🛠️ Otros Comandos Útiles

- **`npm run build`**: Compila todos los proyectos.
- **`npm run test`**: Ejecuta las pruebas unitarias.
- **`npm run lint`**: Analiza el código con ESLint y corrige problemas menores.
- **`npm run format`**: Aplica formato a todo el código utilizando Prettier.
- **`npm run kill-stale`**: Fuerza el cierre de aplicaciones previas que estén usando el puerto 3000 o procesos de Nest que se hayan quedado colgados.

---

## 🧠 Reglas de Negocio (Business Rules)

### 1. Restricción de 30 Días para Solicitudes Finalizadas
Para evitar abusos en el sistema, se ha implementado una regla transversal en la API y Microservicios:
- Si un cliente tiene una solicitud en estado **FINALIZADA**, no podrá iniciar un nuevo proceso de simulación ni crear una nueva solicitud hasta que hayan transcurrido **30 días** desde la fecha de finalización.
- **Endpoint afectado (`/api/v1/users/validate`)**: Al momento de validar el documento, el Gateway consulta al microservicio de `applications` mediante el patrón `CHECK_RECENT_FINALIZED_APPLICATION_BY_CLIENT_ID`.
- **Endpoint afectado (`/api/v1/applications` POST)**: Como medida de seguridad secundaria, el caso de uso `CreateApplicationUseCase` vuelve a validar esta restricción al momento de la creación.
- **Respuesta Esperada**: Cuando se activa el bloqueo, el API Gateway retorna un error HTTP 400 (Bad Request) con el siguiente formato:
  ```json
  {
    "message": "Tiene una solicitud finalizada recientemente. Podrá iniciar un nuevo proceso a partir del 15 de septiembre de 2026.",
    "error": "Bad Request",
    "statusCode": 400,
    "availableDate": "2026-09-15T00:00:00.000Z",
    "daysRemaining": 15
  }
  ```

### 2. Manejo de Razones de Abandono y Finalización
- Al finalizar una solicitud **SIN DESEMBOLSO** o al **ABANDONAR**, es obligatorio proveer un motivo (`reason`).
- Estos motivos quedan registrados tanto en la entidad principal de la base de datos (Application) como en el historial inmutable de auditoría (Events), asegurando trazabilidad para el equipo administrativo.
