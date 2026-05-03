# PC Builder Alltec Demo

Aplicación frontend para armar una PC virtual usando productos de Alltec o datos mock. El objetivo actual es demostrar el flujo MVP: catálogo de componentes, compatibilidad, armado visual y solicitud comercial mock, sin checkout, pago ni backend propio.

## Estado Actual

- Frontend React + TypeScript + Vite.
- Catálogo cargado por proveedor: API Alltec opcional, fixture Alltec local o mock local.
- Fixture demo Alltec con productos reales y specs estimadas marcadas como revisión.
- Compatibilidad en funciones de dominio testeadas.
- Catálogo virtualizado y filtrado por stock/compatibilidad.
- Solicitud comercial mock con datos de contacto y snapshot de build.
- Sin persistencia, sin pagos y sin carrito propio.

## Requisitos

- Node.js compatible con el proyecto.
- npm.

Instalar dependencias:

```bash
npm install
```

## Ejecutar Localmente

```bash
npm run dev
```

Vite mostrará la URL local. Si el puerto `5173` está ocupado, usará otro puerto, por ejemplo:

```text
http://127.0.0.1:5174/
```

## Comandos

```bash
npm run dev
npm run build
npm run lint
npm run test
```

Catálogo Alltec:

```bash
npm run scrape:alltec
npm run scrape:alltec:demo
npm run validate:alltec-fixture -- public/data/alltec-products.json
```

`scrape:alltec` corre en modo estricto: rechaza productos si faltan specs críticas o si tendría que inferirlas.

`scrape:alltec:demo` genera un fixture balanceado para probar la app. Este modo permite specs estimadas y las marca con `dataQuality: incomplete`, `reviewSeverity` y `reviewReasons`.

## Flujo De Uso

1. Seleccionar componentes desde el catálogo.
2. La app filtra productos sin stock por defecto.
3. Después de elegir un producto, el catálogo muestra solo alternativas compatibles.
4. Completar la build.
5. Presionar `Solicitar Armado`.
6. Ingresar nombre, email o teléfono y comuna.
7. Enviar solicitud mock.

La solicitud genera un payload local con:

- datos de contacto;
- productos seleccionados;
- precio total estimado;
- consumo estimado;
- stock/precio al momento del envío;
- issues de compatibilidad;
- resultado de revalidación mock.

## Fuentes De Catálogo

La app usa esta prioridad:

1. API Alltec si existe `VITE_ALLTEC_PRODUCTS_API`.
2. Fixture local `public/data/alltec-products.json`.
3. Mock local de `src/data/products.ts`.

Ejemplo con API:

```bash
VITE_ALLTEC_PRODUCTS_API="https://example.com/products" npm run dev
```

La API debe ser pública o estar disponible con CORS sin secretos embebidos en el frontend. Si requiere credenciales privadas, corresponde pasar a un backend liviano en una fase posterior.

## Limitaciones

- El fixture público de Alltec no debe tratarse como fuente oficial.
- Las specs estimadas sirven para demo, no para compatibilidad comercial real.
- Precio y stock deben revalidarse contra una fuente oficial antes de una venta real.
- No hay persistencia de solicitudes.
- No hay panel admin real.
- No hay integración con carrito ni pago.

## Documentación

- [Documentación principal](docs/README.md)
- [Roadmap](docs/roadmap.md)
- [Arquitectura](docs/architecture.md)
- [Integración Alltec](docs/alltec-integration.md)
- [Reglas de compatibilidad](docs/compatibility-rules.md)
- [Performance](docs/performance.md)
- [Guía para agentes](AGENTS.md)

## Estructura Relevante

```text
src/domain/                 Reglas puras de compatibilidad y solicitud
src/services/catalog/        Proveedores, adaptador Alltec y cache
src/services/quote/          Envío mock de solicitud
src/features/builder/        Componentes y hooks del armador
public/data/                 Fixtures Alltec generados
scripts/                     Scraper y validadores
docs/                        Decisiones de producto, arquitectura y roadmap
```

## Próximo Hito

El siguiente paso recomendado es probar el adaptador con un export/API real de Alltec. Si Alltec no ofrece API pública con CORS, el siguiente bloque debería ser un backend liviano para proteger credenciales, revalidar precio/stock y enviar solicitudes reales.
