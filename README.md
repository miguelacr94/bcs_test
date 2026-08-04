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
