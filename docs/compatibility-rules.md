# Reglas de compatibilidad

## Principio

Las reglas deben ser funciones puras: reciben una build y/o producto candidato, devuelven errores o advertencias. No deben depender de React, del DOM ni de la fuente de datos.

## Severidades

- `error`: bloquea que la build se marque como compatible/lista para compartir sin advertencia critica.
- `warning`: permite copiar, exportar o solicitar la build, pero debe quedar visible para cliente y admin.
- `info`: dato util para ayudar al usuario o al vendedor.
- `review`: faltan datos criticos y la build requiere revision interna.

## Reglas iniciales

### CPU y motherboard

- Error si el socket del CPU no coincide con el socket de la motherboard.

### Motherboard y RAM

- Error si el tipo de RAM no coincide con el tipo soportado por la motherboard.
- Error si la cantidad de modulos supera los slots disponibles.
- Warning si la capacidad supera el maximo soportado.

### Gabinete y motherboard

- Error si el form factor de la motherboard no esta soportado por el gabinete.

### Gabinete y GPU

- Error si el largo de la GPU supera el maximo soportado por el gabinete.

### Gabinete y cooler AIO

- Error si el tamano del radiador AIO supera el maximo soportado por el gabinete.

### Gabinete y cooler de aire

- Warning o error, segun politica de producto, si la altura del cooler supera el maximo del gabinete.

### CPU y cooler

- Error si el socket del CPU no esta soportado por el cooler.
- Warning si el TDP del CPU supera la capacidad recomendada del cooler.

### PSU y consumo

- Error si el consumo estimado supera el wattage de la fuente.
- Warning si el consumo estimado supera el 85% del wattage.

### Datos incompletos

- `review` si falta una spec critica para validar una regla relevante.
- El producto puede mostrarse, pero el resumen de build debe indicar que requiere confirmacion de Alltec.

## Reglas futuras

- Compatibilidad de almacenamiento con slots M.2/SATA disponibles.
- Cantidad maxima de GPUs o dispositivos PCIe.
- Conectores de PSU requeridos por GPU.
- BIOS requerida para CPUs especificos.
- QVL o recomendaciones de memoria para motherboards.
- Recomendaciones por uso: gaming, edicion, workstation.

## Tests minimos

- CPU AM5 con motherboard LGA1851 debe fallar.
- RAM DDR4 con motherboard DDR5 debe fallar.
- GPU demasiado larga debe fallar.
- AIO demasiado grande debe fallar.
- PSU insuficiente debe fallar.
- Cooler con socket incompatible debe fallar.
- Producto con spec critica faltante debe producir `review`.
- Build valida no debe producir errores.
