# Arquitectura objetivo

## Estado actual

Stack actual:

- React
- TypeScript
- Vite
- Tailwind CSS
- `@dnd-kit/core`
- Datos hardcodeados en `src/data/products.ts`

La app funciona completamente en frontend. La compatibilidad y el catalogo viven en memoria.

## Stack por etapa

### MVP/demo

- Frontend: TypeScript con React y Vite.
- Datos: JSON/fixtures grandes con productos mock o semi-reales.
- Solicitud comercial: simulada.
- Virtualizacion: TanStack Virtual o alternativa equivalente para catalogos grandes.
- Tests de dominio: Vitest.
- E2E: Playwright.

### Integracion real sin base propia

- Adaptador API-first para consumir productos Alltec si la empresa expone una API.
- Cache no autoritativo para rendimiento.
- Revalidacion contra Alltec antes de enviar una solicitud.
- Backend liviano solo si se necesita enviar solicitudes por email, API o canal acordado.

### Fase futura opcional

- Backend: TypeScript con NestJS.
- Base de datos: PostgreSQL.
- ORM: Prisma.

PostgreSQL no es requisito para presentar el MVP. Entra solo si Alltec valida el producto y se necesita persistencia robusta, admin real, historial, auditoria, snapshots o sincronizacion avanzada.

## Direccion recomendada

Avanzar en capas:

1. Dominio.
2. Acceso a datos.
3. Estado de la build.
4. UI.
5. Solicitudes comerciales.
6. Administracion.
7. Integraciones externas.

## Capas propuestas

### Dominio

Ubicacion sugerida: `src/domain`

Responsabilidades:

- Tipos de productos.
- Tipos de build.
- Reglas puras de compatibilidad.
- Calculo de consumo y precio.
- Validaciones testeables sin React.

### Catalogo y datos

Ubicacion sugerida frontend: `src/services` o `src/data-access`

Responsabilidades:

- Obtener productos desde mock, API o backend.
- Aplicar filtros, busqueda y paginacion.
- Adaptar la respuesta al modelo interno.
- Manejar carga, vacio, error y datos incompletos.

El frontend no debe importar directamente una fuente hardcodeada desde paginas principales.

### Backend opcional

Para la demo no se requiere backend. Si se necesita enviar solicitudes reales antes de incorporar una base de datos, crear un backend liviano que reciba la solicitud y la envie por email, API o canal acordado con Alltec.

Stack futuro sugerido cuando exista persistencia real:

- NestJS.
- PostgreSQL.
- Prisma.
- Validacion con DTOs y Zod o class-validator, segun convencion elegida al crear backend.

Responsabilidades:

- Catalogo paginado y filtrable si no se consume directamente desde API Alltec.
- Normalizacion de productos Alltec.
- Validacion de builds.
- Recepcion de solicitudes comerciales reales.
- Login de admin/vendedor.
- Panel o endpoints administrativos basicos.
- Sincronizacion desde API, export o lectura controlada si se decide persistir datos propios.

### Estado de build

Ubicacion sugerida: `src/features/builder`

Responsabilidades:

- Build seleccionada.
- Acciones: agregar, remover, limpiar, reemplazar.
- Persistencia local opcional.
- Preparar payload de solicitud.

Para el estado inicial basta con React state o reducer. Si crece, evaluar Zustand.

### UI

Ubicacion sugerida:

- `src/features/builder/components`
- `src/components`

Responsabilidades:

- Catalogo.
- Filtros.
- Tarjetas de producto.
- Builder visual.
- Resumen.
- Solicitud comercial.

La UI no debe contener reglas complejas de compatibilidad ni conocer detalles de la fuente de datos.

## Contrato funcional objetivo futuro

- `GET /products`: catalogo paginado con filtros.
- `GET /products/:id`: detalle normalizado.
- `POST /builds/validate`: valida compatibilidad de una build.
- `POST /quote-requests`: envia solicitud comercial con contacto minimo.
- `GET /admin/quote-requests`: admin revisa solicitudes.
- `POST /admin/imports/run`: admin dispara o supervisa sincronizacion.

Para el MVP/demo estos endpoints pueden ser simulados por servicios frontend y datos JSON.

## Integracion con Alltec

La app debe vivir como sitio aparte inicialmente. La integracion directa con el sitio Alltec, carrito o pago queda como fase futura.

La integracion de datos debe pasar por adaptadores:

- API del cliente como opcion ideal.
- Import/export programado como fallback.
- Lectura controlada de base de datos solo si Alltec lo habilita con permisos de solo lectura.

No se debe acoplar dominio ni UI a detalles especificos del sitio Alltec.
