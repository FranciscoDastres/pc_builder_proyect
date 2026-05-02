# Vision del producto

## Objetivo

Construir un armador de PC para Alltec, tienda chilena especializada en hardware. El usuario debe poder armar una PC virtualmente usando productos de Alltec, validar compatibilidad, ver precio/stock estimado y enviar una solicitud comercial para que Alltec confirme la venta y el armado.

## Producto

La primera version sera un sitio aparte y puede funcionar con JSON/fixtures grandes para presentar el flujo. Si Alltec valida la demo, se conectara a datos reales por API o importacion controlada. No reemplaza el ecommerce actual ni procesa pagos.

El flujo esperado es:

1. El cliente elige componentes compatibles.
2. La app muestra errores, advertencias, precio total y disponibilidad.
3. El cliente ingresa datos minimos de contacto.
4. La app simula o envia una solicitud comercial a Alltec, segun la etapa.
5. Un admin/vendedor revisa la solicitud y contacta al cliente.

## Usuarios principales

- Cliente publico que quiere armar un PC sin dominar todos los detalles tecnicos.
- Admin/vendedor interno de Alltec, tratado como un mismo rol operativo en el MVP.

## Experiencia esperada

- Buscar componentes por categoria, marca, precio, socket, formato, consumo y stock.
- Ver componentes incompatibles claramente marcados.
- Entender por que una pieza no calza con la build.
- Ver precio total en CLP con IVA incluido.
- Enviar una solicitud de armado con baja friccion.
- Permitir que Alltec revise solicitudes y confirme disponibilidad real.

## Alcance MVP

- Armador con slots principales: gabinete, CPU, motherboard, RAM, GPU, PSU, almacenamiento y cooler.
- Catalogo preparado para 1000 a 10000 productos.
- Validacion basica y extensible de compatibilidad.
- Integracion preparada para datos reales de Alltec.
- Solicitud comercial mock con contacto minimo para demo.
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

## Datos minimos de solicitud

- Nombre.
- Email o telefono.
- Comuna.
- Comentario opcional.
- Build seleccionada.
- Precio total estimado.
- Estado de stock/precio al momento de envio.

## Metricas de exito

- La app navega fluidamente un catalogo de 1000 a 10000 productos.
- Una build incompatible se detecta antes de enviar solicitud.
- Las reglas de compatibilidad tienen tests automatizados.
- El catalogo no depende de `src/data/products.ts`.
- Alltec puede revisar solicitudes con informacion suficiente para cerrar la venta.
