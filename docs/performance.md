# Rendimiento

## Objetivo

La aplicacion debe mantenerse fluida con catalogos de 1000 a 10000 componentes.

## Riesgos actuales

- El catalogo se agrupa filtrando todo el arreglo por cada categoria en cada render.
- La busqueda recorre todos los productos en memoria.
- Las tarjetas se renderizan completas aunque no esten visibles.
- La compatibilidad se calcula por producto visible en render.
- No existe paginacion ni virtualizacion.

## Estrategia recomendada

### 1000 productos

- Memoizar agrupacion y filtros.
- Reducir renders innecesarios.
- Usar componentes memoizados para tarjetas.
- Medir con catalogo mock grande.

### 10000 productos

- No renderizar toda la lista.
- Usar virtualizacion.
- Aplicar filtros y busqueda en un servicio desacoplado; puede ser frontend para demo JSON y backend/API para integracion real.
- Usar paginacion o infinite scroll.
- Cachear resultados por categoria y filtros.
- Evitar recalcular compatibilidad para productos fuera de pantalla.

## Datos, API y cache

- Para demo, probar con JSON/fixtures de 1000 a 10000 productos.
- Usar paginacion o virtualizacion aunque el origen sea JSON.
- Para integracion real, consumir API Alltec mediante adaptador.
- Cachear catalogo solo como optimizacion no autoritativa.
- Revalidar precio/stock antes de enviar solicitud comercial real.
- PostgreSQL e indices quedan para una fase futura con persistencia propia.

## Librerias sugeridas

- `@tanstack/react-query` para cache de datos remotos.
- `@tanstack/react-virtual` para virtualizacion.
- `zustand` solo si el estado del builder crece.
- `vitest` para reglas de dominio.
- `@playwright/test` para pruebas end-to-end.

## Metricas practicas

- Primera carga menor a 2 segundos en desarrollo local con mock razonable.
- Interaccion de busqueda sin bloqueo perceptible.
- Scroll sin saltos con 10000 productos mock.
- Cambio de componente seleccionado menor a 100 ms percibidos.
- Validacion de build completa sin bloquear la UI.

## Checklist antes de escalar datos

- [ ] Hay fixtures grandes para prueba local.
- [ ] El catalogo esta virtualizado o paginado.
- [ ] La busqueda no bloquea el render principal.
- [ ] Las reglas de compatibilidad estan testeadas.
- [ ] El servicio de catalogo puede filtrar por categoria y specs.
- [ ] Hay medicion documentada con 1000 y 10000 productos.
