# Directrices de Arquitectura y Limpieza de Código (Clean Code Rules)

Este documento define las reglas de diseño arquitectónico y de tipado estricto que se deben respetar de forma mandatoria en todo el proyecto.

---

## 1. Responsabilidad Única del Controlador (SRP)
*   **Regla**: Los controladores del API Gateway **no deben** realizar llamadas directas a los microservicios usando `ClientProxy.send` o `ClientProxy.emit` para operaciones de composición u orquestación compleja.
*   **Estándar**: Toda la lógica de composición, agregación, timeouts, reintentos y fallbacks (resiliencia) debe delegarse a una **Capa de Servicios dedicada** (ej: `CustomerDashboardService`).
*   **Propósito**: Mantener los controladores limpios, encargados únicamente de definir rutas HTTP, bindings y manejar excepciones de red, permitiendo a su vez probar la lógica de negocio con pruebas unitarias aisladas.

---

## 2. Tipado Estricto (TypeScript Obligatorio)
*   **Regla**: Queda estrictamente prohibido el uso del tipo `any` y tipos implícitos o indeterminados `unknown` en firmas de métodos públicos o retornos de servicios.
*   **Estándar**:
    *   Todas las respuestas devueltas por los microservicios deben contar con interfaces de tipado que las definan (ej: `CustomerResponse`, `ApplicationResponse`).
    *   Estas interfaces de transferencia de datos deben residir en la librería compartida (`libs/shared/src/interfaces/api-responses.interface.ts`) para evitar duplicaciones innecesarias de interfaces.

---

## 3. Formato Unificado de Respuestas HTTP
*   **Regla**: Todos los endpoints expuestos en el API Gateway deben devolver un formato de respuesta unificado utilizando el envoltorio genérico `ApiResponse<T>`.
*   **Formato Estándar**:
    ```typescript
    export interface ApiResponse<T> {
      success: boolean;
      message: string;
      data: T;
    }
    ```
*   **Propósito**: Asegurar predictibilidad y homogeneidad para el cliente que consume la API (frontend u otros servicios externos).
