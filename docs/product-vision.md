# Vision del producto

## Objetivo

Construir un armador de PC para Alltec, tienda chilena especializada en hardware. El usuario debe poder armar una PC virtualmente usando productos de Alltec, validar compatibilidad, ver precio/stock estimado y recibir una build clara como resultado principal. La solicitud comercial existe como accion secundaria posterior, no como el centro del MVP.

## Producto

La primera version sera un sitio aparte y puede funcionar con JSON/fixtures grandes para presentar el flujo. Si Alltec valida la demo, se conectara a datos reales por API o importacion controlada. No reemplaza el ecommerce actual ni procesa pagos.

El flujo esperado es:

1. El cliente elige componentes compatibles.
2. La app muestra errores, advertencias, precio total, disponibilidad y specs relevantes.
3. La app entrega un resumen de build listo para revisar, compartir o exportar.
4. El cliente puede copiar la build, guardar el resumen localmente o enviarla a Alltec como solicitud comercial opcional.
5. Alltec revisa la build fuera de la app en la demo; un panel admin queda para fase futura.

## Usuarios principales

- Cliente publico que quiere armar un PC sin dominar todos los detalles tecnicos.
- Admin/vendedor interno de Alltec como rol operativo futuro. En la demo no hay login ni panel interno.

## Experiencia esperada

- Buscar componentes por categoria, marca, precio, socket, formato, consumo y stock.
- Ver componentes incompatibles claramente marcados.
- Entender por que una pieza no calza con la build.
- Ver precio total en CLP con IVA incluido.
- Ver un resumen de build permanente mientras se seleccionan piezas.
- Compartir, copiar o exportar la build como resultado principal.
- Enviar una solicitud de armado con baja friccion como accion secundaria.
- Permitir que Alltec revise el resumen de build por un canal manual o mock en la demo, y por panel interno en una fase futura.

## Modelo UI/UX objetivo

En desktop, el armador debe organizarse en tres zonas persistentes:

1. Catalogo: lista virtualizada de productos, buscador y filtros por slot, marca, precio, stock y compatibilidad.
2. Build actual: slots principales del PC, componentes seleccionados, acciones de reemplazar/quitar y total estimado.
3. Resumen/inspector: estado de compatibilidad, stock, precio total, detalle del producto enfocado y acciones para copiar, compartir, exportar o solicitar.

La tercera columna es contextual. Por defecto muestra el resumen de build; si hay errores debe priorizar compatibilidad; si el usuario enfoca un producto debe mostrar detalle y razon de compatibilidad.

En mobile, estas zonas deben convertirse en tabs o pasos equivalentes: Catalogo, Build y Resumen.

## Alcance MVP

- Armador con slots principales: gabinete, CPU, motherboard, RAM, GPU, PSU, almacenamiento y cooler.
- Catalogo preparado para 1000 a 10000 productos.
- Validacion basica y extensible de compatibilidad.
- Integracion preparada para datos reales de Alltec.
- Resumen de build con precio, stock, compatibilidad y specs clave.
- Acciones mock/locales para copiar o exportar la build.
- Solicitud comercial mock con contacto minimo para demo, tratada como accion secundaria.
- Sin login cliente.
- Sin base de datos propia obligatoria.

## Fuera de alcance MVP

- Checkout completo.
- Pago online.
- Carrito propio.
- Integracion directa con el carrito del sitio Alltec.
- Multi-tienda.
- Recomendador automatico avanzado.
- Panel administrativo ecommerce completo.
- Scraping no autorizado como fuente oficial.
- PostgreSQL como requisito de MVP.

## Datos minimos de build

- Componentes seleccionados.
- Precio total estimado.
- Estado de stock por componente.
- Estado de compatibilidad general.
- Errores, advertencias y revisiones requeridas.
- Specs clave por componente.
- Fecha/hora del snapshot si se comparte, exporta o solicita.

## Datos minimos de solicitud opcional

- Nombre.
- Email o telefono.
- Comuna.
- Comentario opcional.
- Build seleccionada.
- Precio total estimado.
- Estado de stock/precio al momento de envio.

## Metricas de exito

- La app navega fluidamente un catalogo de 1000 a 10000 productos.
- Una build incompatible se detecta antes de compartir, exportar o solicitar.
- Las reglas de compatibilidad tienen tests automatizados.
- El catalogo no depende de `src/data/products.ts`.
- El usuario puede entender y compartir una build sin pedir ayuda externa.
- Alltec puede revisar builds o solicitudes con informacion suficiente para cerrar la venta.
