# Benchmarks

Este documento resume referencias objetivas para orientar el armador de PC de Alltec. No se trata de copiarlas, sino de extraer patrones probados.

Las referencias a checkout, compra, reserva o pago describen lo que hacen otros productos. No forman parte del MVP/demo de Alltec. El cierre principal del MVP es una build clara, validada y compartible/exportable; la solicitud comercial queda como accion secundaria.

## Micro Center PC Builder

Fuente: https://www.microcenter.com/site/content/custom-pc-builder.aspx

### Lo relevante

- Herramienta de tienda para elegir partes desde inventario disponible.
- Filtra automaticamente partes incompatibles con selecciones previas.
- Conecta la build con servicios de armado y compra/reserva.
- Permite compartir la build para recibir feedback.

### Aprendizaje para Alltec

Micro Center es la referencia principal porque combina catalogo real, compatibilidad y build compartible. Para Alltec, la primera version debe reemplazar el checkout por un resumen de build util y una solicitud comercial opcional.

## LDLC PC Builder

Fuente: https://www.ldlc.com/en/pc-builder/

### Lo relevante

- Configurador de tienda con componentes por categoria.
- Declara compatibilidad asegurada.
- La seleccion se ajusta segun componentes agregados.
- Incluye opciones y perifericos ademas de componentes principales.

### Aprendizaje para Alltec

LDLC valida que el modelo de "configurador de tienda" funciona cuando el catalogo y las reglas guian al usuario. En Alltec conviene partir con componentes principales, mantener la build visible y dejar perifericos para fase futura.

## PCPartPicker

Fuente: https://www.linkedin.com/company/pcpartpicker-llc

### Lo relevante

- Enfocado en seleccionar partes, comparar precios y compartir listas.
- La compatibilidad es parte central del valor.
- Las listas permanentes y compartibles ayudan a discusion y revision.

### Aprendizaje para Alltec

PCPartPicker es el benchmark de compatibilidad, claridad tecnica y build como artefacto compartible. Alltec no necesita ser comparador multi-tienda en el MVP, pero si debe aprender de sus warnings, filtros y resumen permanente.

## NZXT Custom PCs

Fuente: https://nzxt.com/en-US/build/pc

### Lo relevante

- Experiencia guiada por familias/prebuilts.
- Enfatiza performance esperada y configuraciones preseleccionadas.
- Reduce libertad para simplificar compra.

### Aprendizaje para Alltec

NZXT sirve como referencia secundaria para una experiencia guiada. Si Alltec quiere vender "builds recomendadas", puede agregarse despues como plantillas editables.

## Alltec

Fuente: https://www.alltec.cl/

### Observaciones utiles

- Tiene categorias de hardware como gabinetes, fuentes, placas madre, procesadores, refrigeracion, memorias, almacenamiento y tarjetas de video.
- Muestra precios con impuestos incluidos.
- Muestra stock.
- Tiene carrito existente.
- Tiene contacto telefonico y WhatsApp visible.
- Tiene categoria Custom PC.

### Implicancia

El armador debe partir como sitio aparte y entregar una build revisable como valor principal. La solicitud comercial puede actuar como puente hacia Alltec, pero la integracion directa con carrito o pago queda para una fase posterior, cuando haya acceso tecnico y aprobacion.

## Patron UI recomendado

Los benchmarks apuntan a una experiencia de herramienta: catalogo filtrable, build siempre visible y resumen tecnico accionable. Para Alltec, el layout objetivo en desktop es de tres columnas:

1. Catalogo de productos compatibles.
2. Build actual por slots.
3. Resumen/inspector con total, compatibilidad, stock, detalle contextual y acciones.

En mobile, estas columnas se transforman en tabs: Catalogo, Build y Resumen.
