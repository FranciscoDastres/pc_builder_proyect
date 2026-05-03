# Rendimiento

## Objetivo

La aplicacion debe mantenerse fluida con catalogos de 1000 a 10000 componentes.

## Riesgos actuales

- El catalogo se agrupa filtrando todo el arreglo por cada categoria en cada render.
- La busqueda recorre todos los productos en memoria.
- Las tarjetas se renderizan completas aunque no esten visibles.
- La compatibilidad se calcula por producto visible en render.
- No existe paginacion ni virtualizacion.
- Una UI de tres columnas puede aumentar renders si catalogo, build y resumen comparten estado sin memoizacion.

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
- Separar estado derivado de catalogo, build y resumen para que una columna no fuerce render completo de las otras.

## Datos, API y cache

- Para demo, probar con JSON/fixtures de 1000 a 10000 productos.
- Usar paginacion o virtualizacion aunque el origen sea JSON.
- Para integracion real, consumir API Alltec mediante adaptador.
- Cachear catalogo solo como optimizacion no autoritativa.
- Revalidar precio/stock antes de enviar solicitud comercial real.
- Generar resumen de build desde datos ya normalizados para evitar parseos o recalculos costosos en UI.
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
- Actualizacion de total/resumen sin re-renderizar toda la lista virtualizada.

## Benchmark local reproducible

Comando:

```bash
npm run benchmark:catalog
```

El benchmark expande `public/data/alltec-products.json` a catalogos de 1000 y 10000 productos, agrupa por slot, oculta productos sin stock, aplica compatibilidad contra una build activa, filtra busqueda y construye las filas que consume la lista virtualizada.

Este benchmark no reemplaza QA visual ni perfilado en navegador, pero deja una medicion rapida para detectar regresiones en operaciones de catalogo.

Resultado local mas reciente:

| productos | agrupar | filtro default | busqueda | filas virtuales | visibles | ocultos sin stock | ocultos incompatibles |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 1000 | 1.22 ms | 2.29 ms | 2.68 ms | 1.39 ms | 395 | 586 | 19 |
| 10000 | 4.37 ms | 6.40 ms | 25.92 ms | 1.91 ms | 3856 | 5937 | 207 |

Cobertura relacionada:

- `src/features/builder/utils/catalogView.test.ts`: verifica ocultar sin stock por defecto, filtrar incompatibles cuando hay build seleccionada y mostrar productos en revision.
- `src/features/builder/utils/buildStorage.test.ts`: verifica guardado/restauracion por slot e ID.
- `src/features/builder/utils/buildSummaryText.test.ts`: verifica el artefacto de texto exportable con componentes, totales, specs e issues.

## Checklist antes de escalar datos

- [ ] Hay fixtures grandes para prueba local.
- [ ] El catalogo esta virtualizado o paginado.
- [ ] La busqueda no bloquea el render principal.
- [ ] Las reglas de compatibilidad estan testeadas.
- [ ] El servicio de catalogo puede filtrar por categoria y specs.
- [ ] Hay medicion documentada con 1000 y 10000 productos.
