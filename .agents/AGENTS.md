# Directrices de Arquitectura y Limpieza de Código (Clean Code Rules)

Este documento define las reglas de diseño arquitectónico y de tipado estricto que se deben respetar de forma mandatoria en todo el proyecto.

---

## 1. Responsabilidad Única del Controlador (SRP)

- **Regla**: Los controladores del API Gateway **no deben** realizar llamadas directas a los microservicios usando `ClientProxy.send` o `ClientProxy.emit` para operaciones de composición u orquestación compleja.
- **Estándar**: Toda la lógica de composición, agregación, timeouts, reintentos y fallbacks (resiliencia) debe delegarse a una **Capa de Servicios dedicada** (ej: `CustomerDashboardService`).
- **Propósito**: Mantener los controladores limpios, encargados únicamente de definir rutas HTTP, bindings y manejar excepciones de red, permitiendo a su vez probar la lógica de negocio con pruebas unitarias aisladas.

---

## 2. Tipado Estricto (TypeScript Obligatorio)

- **Regla**: Queda estrictamente prohibido el uso del tipo `any` y tipos implícitos o indeterminados `unknown` en firmas de métodos públicos o retornos de servicios.
- **Estándar**:
  - Todas las respuestas devueltas por los microservicios deben contar con interfaces de tipado que las definan (ej: `CustomerResponse`, `ApplicationResponse`).
  - Estas interfaces de transferencia de datos deben residir en la librería compartida (`libs/shared/src/interfaces/api-responses.interface.ts`) para evitar duplicaciones innecesarias de interfaces.

---

## 3. Formato Unificado de Respuestas HTTP

- **Regla**: Todos los endpoints expuestos en el API Gateway deben devolver un formato de respuesta unificado utilizando el envoltorio genérico `ApiResponse<T>`.
- **Formato Estándar**:
  ```typescript
  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }
  ```
- **Propósito**: Asegurar predictibilidad y homogeneidad para el cliente que consume la API (frontend u otros servicios externos).

---

## 4. No Repetición (DRY), Guard Clauses y Programación Funcional

- **Regla**:
  - **DRY (Don't Repeat Yourself)**: Si la misma secuencia de lógica o consulta de datos (ej: obtener cliente y lanzar NotFound) se repite más de 2 veces, **debe** extraerse a un método auxiliar privado dentro de la clase.
  - **Guard Clauses (Cláusulas de Guarda)**: Se debe retornar lo antes posible si se cumple una condición de fallo o fallback, reduciendo la anidación del bloque principal `if/else`.
  - **Programación Funcional**: Se prefiere el uso de métodos funcionales nativos (`.filter()`, `.map()`, `.reduce()`) para realizar agregaciones y sumatorias en colecciones de datos, evitando bucles mutables complejos (`for...of` con acumuladores `let`) que puedan inducir a errores colaterales.

---

## 5. Arquitectura Limpia en Cores (Casos de Uso vs Servicios)

- **Regla**:
  - **Microservicios de Core**: Los microservicios que contienen reglas de negocio (ej. `applications`, `customer`, `disbursements`, `offer-core`) **no deben** utilizar clases `.service.ts`. Toda lógica de negocio debe estructurarse mediante Casos de Uso (`.use-case.ts`) independientes bajo el directorio `/application/use-cases/`.
  - **API Gateway**: Se mantiene el uso de clases `.service.ts` ya que su función exclusiva es de orquestación y ruteo, no de reglas de negocio.

---

## 6. Separación de DTOs de Paginación y Filtrado

- **Regla**: Los DTOs de paginación (`PaginationDto`) deben permanecer limpios, conteniendo únicamente propiedades universales de paginado (ej. `page`, `limit`).
- **Estándar**: Todo endpoint que acepte filtros adicionales de búsqueda o criterios específicos (ej. buscar por estado, por documento, rango de fechas) debe contar con su propio DTO (ej. `GetApplicationsFilterDto`) que extienda de `PaginationDto`.
- **Propósito**: Asegurar un tipado estricto e independiente, evitar que filtros específicos contaminen el DTO genérico de paginado, y mantener limpia la autogeneración de documentación (Swagger).
