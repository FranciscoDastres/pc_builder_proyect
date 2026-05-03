# UI/UX objetivo

## Norte

La experiencia debe sentirse como una herramienta de armado, no como una grilla ecommerce generica. El resultado principal es una build clara, validada y facil de compartir. La solicitud comercial queda como accion secundaria.

Referencias principales:

- Micro Center PC Builder: catalogo de tienda, compatibilidad y build compartible.
- LDLC PC Builder: seleccion por categorias con compatibilidad guiada.
- PCPartPicker: resumen tecnico, warnings y listas compartibles.
- NZXT Custom PCs: guia secundaria para builds recomendadas, no como modelo principal del MVP.

## Layout desktop

Usar tres columnas persistentes:

```text
┌────────────────────┬────────────────────────┬──────────────────────┐
│ Catalogo           │ Build actual            │ Resumen / Inspector  │
│                    │                         │                      │
│ Slot activo        │ CPU                     │ Total                │
│ Busqueda           │ Motherboard             │ Compatibilidad       │
│ Filtros            │ RAM                     │ Stock                │
│ Productos          │ GPU                     │ Acciones             │
│                    │ Storage                 │ Detalle contextual   │
└────────────────────┴────────────────────────┴──────────────────────┘
```

### Columna 1: Catalogo

Responsabilidad: encontrar y seleccionar productos.

Debe incluir:

- Slot activo.
- Buscador.
- Filtros por marca, precio, stock, compatibilidad y specs criticas.
- Lista virtualizada.
- Estados visibles: compatible, advertencia, no compatible, sin stock, requiere revision.
- Accion para seleccionar o reemplazar.

Regla: productos sin stock se ocultan por defecto, con control explicito para mostrarlos.

### Columna 2: Build actual

Responsabilidad: mostrar la estructura del PC.

Debe incluir:

- Slots principales: CPU, motherboard, RAM, GPU, almacenamiento, PSU, gabinete y cooler.
- Producto seleccionado o estado pendiente por slot.
- Precio y stock por componente.
- Acciones para quitar, reemplazar o enfocar el slot.
- Total estimado.
- Estado general de compatibilidad.

Esta columna es el centro visual del producto.

### Columna 3: Resumen / Inspector

Responsabilidad: explicar la build y entregar el resultado.

Debe incluir:

- Total estimado en CLP con IVA incluido.
- Estado de stock de la build.
- Errores bloqueantes, advertencias y revisiones requeridas.
- Detalle del producto enfocado cuando aplique.
- Acciones: copiar build, exportar resumen, compartir link futuro y solicitar armado.

Comportamiento contextual:

- Por defecto muestra el resumen de build.
- Si existen errores, prioriza compatibilidad.
- Si el usuario enfoca un producto, muestra detalle y razon de compatibilidad.
- La solicitud comercial aparece al final como siguiente paso, no como objetivo principal.

## Layout mobile

No usar tres columnas en mobile. Convertir las zonas en tabs o pasos:

```text
[Catalogo] [Build] [Resumen]
```

El total, estado de compatibilidad y acceso al resumen deben mantenerse visibles con una barra inferior compacta o header persistente.

## Principios de interaccion

- La build debe ser visible o alcanzable en todo momento.
- Cambiar una pieza debe recalcular filtros compatibles sin bloquear la UI.
- Las razones de bloqueo deben ser especificas y accionables.
- Las advertencias no deben impedir copiar/exportar, pero deben quedar visibles.
- Las specs estimadas o incompletas deben marcarse como revision requerida.
- La app debe permitir avanzar sin login.

## Acciones de build

Prioridad MVP:

1. Copiar resumen como texto.
2. Exportar resumen como TXT en el MVP.
3. Abrir vista imprimible para guardar PDF desde el navegador.
4. Guardar build localmente.
5. Copiar link compartible local.
6. Solicitar armado como accion secundaria.

Futuro:

- Link compartible persistente con backend.
- PDF generado en servidor o cliente con plantilla visual avanzada.
- Builds recomendadas por presupuesto o uso.
- Comparacion de alternativas compatibles.
