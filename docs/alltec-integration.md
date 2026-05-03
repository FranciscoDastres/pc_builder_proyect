# Integracion Alltec

## Objetivo

Conectar el armador de PC con datos de Alltec sin acoplar el dominio ni la UI al ecommerce actual.

## Estrategia inicial

La primera entrega vive como sitio aparte. El armador puede usar JSON/fixtures grandes para demo y solicitud mock. No modifica carrito, pedidos ni pagos del sitio Alltec.

Si Alltec valida la demo y expone datos, la estrategia preferida es API-first sin base de datos propia.

## Fuentes de datos

### Opcion ideal: API de Alltec

Alltec expone productos, categorias, precios, stock, imagenes y URLs. El armador consume esa API mediante un adaptador. Puede existir backend liviano si se necesita proteger credenciales, normalizar respuestas o enviar solicitudes reales.

En frontend, el repo ya contempla un proveedor API opcional mediante `VITE_ALLTEC_PRODUCTS_API`. Solo debe usarse si Alltec entrega un endpoint publico o con CORS habilitado y sin secretos embebidos en cliente. La prioridad runtime queda:

1. API Alltec si `VITE_ALLTEC_PRODUCTS_API` existe.
2. Fixture Alltec local en `/data/alltec-products.json`.
3. Mock local del repo.

El contrato esperado para API/export es un arreglo de productos con identidad, precio, stock, categoria, imagen, URL y `specs` estructuradas. El adaptador normaliza ese formato a `Product[]` y marca productos incompletos con `review_required`.

### Fallback: import/export

Si no existe API, Alltec entrega export periodico o acceso a una fuente de lectura. En demo puede transformarse a JSON. En una fase posterior, un backend puede importar, validar y normalizar productos.

### Fixture publico de demo

El repo incluye un scraper manual para generar un fixture local desde paginas publicas de Alltec:

- Comando: `npm run scrape:alltec`.
- Fixture demo balanceado con specs estimadas: `npm run scrape:alltec:demo`.
- Muestra controlada: `ALLTEC_OUTPUT_BASENAME=alltec-products.strict-sample ALLTEC_PER_SLOT_LIMIT=2 ALLTEC_LIMIT=414 npm run scrape:alltec`.
- Validacion: `npm run validate:alltec-fixture -- public/data/alltec-products.json`.
- Salida principal: `public/data/alltec-products.json`.
- Trazabilidad: `public/data/alltec-products.meta.json`.
- Uso runtime: el servicio de catalogo intenta cargar `/data/alltec-products.json` y cae al mock local si no esta disponible.

El scraper corre en modo estricto por defecto: si una spec critica queda inferida, el producto se rechaza y queda trazado en metadata. Para demo se puede desactivar con `ALLTEC_STRICT_SPECS=0`; en ese caso las specs estimadas quedan marcadas con `dataQuality: incomplete`, `reviewSeverity` y `reviewReasons`.

Resultado observado: el HTML publico no expone suficientes specs explicitas para completar todas las categorias del armador sin inferencias. El fixture demo es util para validar importacion, UI y flujo de armado, pero no debe presentarse como compatibilidad real ni reemplaza una API/export autorizado.

### Fallback avanzado: lectura controlada de BD

Solo si Alltec lo permite. Debe ser con permisos de solo lectura y sin modificar datos del ecommerce.

## Datos requeridos

- ID externo o SKU.
- Nombre.
- Marca.
- Categoria.
- Precio en CLP con IVA incluido.
- Stock o disponibilidad.
- Imagen.
- URL del producto en Alltec.
- Descripcion.
- Specs estructuradas o datos suficientes para normalizacion.

## Normalizacion

El adaptador debe mapear categorias de Alltec a slots del armador:

- Gabinetes -> `case`
- Fuentes de Poder -> `psu`
- Placas Madre -> `motherboard`
- Procesadores -> `cpu`
- Refrigeracion -> `cooler`
- Memorias DDR4/DDR5 -> `ram`
- Almacenamiento SSD/HDD -> `storage`
- Tarjetas de Video -> `gpu`

Los productos que no puedan mapearse quedan fuera del armador o pasan a estado de revision.

## Calidad de datos

Estados sugeridos:

- `ready`: producto con specs suficientes para compatibilidad.
- `incomplete`: falta una spec no critica.
- `review_required`: falta una spec critica.
- `disabled`: producto no disponible para el armador.

## Cache y sincronizacion

El cache no es fuente de verdad. Sirve para velocidad, pero precio y stock deben revalidarse contra Alltec antes de enviar una solicitud real.

Estrategias posibles segun la API disponible:

- TTL corto para catalogo, precio y stock.
- `updatedAt` o `lastModified` para traer cambios incrementales.
- `ETag`/`If-None-Match` si la API lo soporta.
- Refresh manual/admin en una fase posterior.
- Webhooks solo si Alltec los ofrece.

Si no existe API, la sincronizacion depende de export/import programado y debe mostrarse la fecha de ultima actualizacion.

## Revalidacion antes de solicitud real

Antes de enviar una solicitud comercial:

- Revalidar compatibilidad.
- Revalidar precio.
- Revalidar stock.
- Incluir snapshot de build, precio y stock en la solicitud.

Si precio o stock cambia, la UI debe informarlo antes de confirmar el envio. En la demo, esta validacion puede simularse.

Persistir snapshots historicos queda para una fase futura con backend/base propia.

## Solicitud comercial

La solicitud no es una orden pagada. Es una oportunidad comercial para que Alltec confirme disponibilidad, armado y condiciones.

Datos minimos:

- Nombre.
- Email o telefono.
- Comuna.
- Comentario opcional.
- Build seleccionada.
- Precio total estimado.
- Estado de stock/precio.

## Futuro opcional

- Enviar productos al carrito Alltec.
- Crear orden en ecommerce.
- Integrar pago.
- Embeder el armador dentro del sitio Alltec.
- Plantillas de builds recomendadas por presupuesto o uso.
