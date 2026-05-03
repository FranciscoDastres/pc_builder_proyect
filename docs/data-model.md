# Modelo de datos

## Principios

- Un producto tiene campos comunes y especificaciones por categoria.
- Las reglas de compatibilidad deben depender de campos estructurados, no de texto libre.
- Los datos de Alltec pueden venir incompletos; se deben validar antes de entrar al catalogo del armador.
- Stock y precio pueden cambiar con frecuencia, por lo que deben tratarse como datos dinamicos.
- Toda transformacion desde datos externos debe quedar trazable.

## Entidades minimas

Estas entidades describen el contrato logico del producto. En el MVP/demo no implican tablas SQL ni requieren PostgreSQL.

Para la demo:

- `Product` vive en JSON/fixtures.
- `Build` vive en estado frontend.
- `BuildSummary` puede generarse en frontend y copiarse/exportarse sin persistencia.
- `QuoteRequest` puede ser mock y no persistirse.

PostgreSQL se incorpora solo en una fase futura si se necesita persistir solicitudes, snapshots, usuarios internos, logs de sincronizacion o correcciones manuales de specs.

### Product

Campos comunes sugeridos:

- `id`
- `externalId`
- `sku`
- `name`
- `brand`
- `category`
- `slot`
- `price`
- `currency`
- `taxIncluded`
- `stock`
- `status`
- `imageUrl`
- `productUrl`
- `description`
- `specs`
- `dataQuality`
- `updatedAt`

### ProductSpecs

Debe ser estructurado por categoria. La descripcion puede ayudar a revisar datos, pero no debe decidir compatibilidad.

### Build

Representa una seleccion de componentes.

- `id`
- `items`
- `totalPrice`
- `totalWatts`
- `issues`
- `stockStatus`
- `updatedAt`
- `createdAt`

### BuildItem

- `slot`
- `productId`
- `quantity`
- `snapshotName`
- `snapshotPrice`
- `snapshotStock`

### CompatibilityIssue

- `slot`
- `severity`
- `code`
- `message`
- `productIds`

### BuildSummary

Representa el artefacto que el usuario recibe como resultado principal.

- `id`
- `buildSnapshot`
- `totalPrice`
- `totalWatts`
- `stockStatus`
- `issues`
- `reviewRequired`
- `source`
- `createdAt`

En el MVP puede existir solo como objeto frontend para copiar texto, mostrar resumen o preparar export. En una fase futura puede persistirse para links compartibles.

### SharedBuild

Entidad futura para links persistentes.

- `id`
- `publicSlug`
- `buildSummary`
- `expiresAt`
- `createdAt`

### QuoteRequest

Solicitud comercial opcional enviada por un cliente desde una build preparada.

- `id`
- `customerName`
- `customerEmail`
- `customerPhone`
- `customerCommune`
- `comment`
- `buildSnapshot`
- `totalPriceSnapshot`
- `stockSnapshot`
- `status`
- `createdAt`

### AdminUser

Usuario interno para admin/vendedor.

Entidad futura. No se implementa login ni panel admin en el MVP/demo; el rol admin/vendedor es operativo y conceptual hasta que exista persistencia real.

- `id`
- `email`
- `name`
- `role`
- `status`
- `createdAt`

Cuando se implemente, vendedor y admin se trataran como el mismo rol operativo inicial salvo que Alltec pida permisos mas granulares.

### ImportSource

Origen de datos.

Entidad futura. No es necesaria para la demo con JSON ni para una primera integracion API-first sin persistencia propia.

- `id`
- `type`
- `name`
- `status`
- `lastSyncAt`
- `config`

### SyncLog

Registro de sincronizacion.

Entidad futura. Aplica cuando exista importacion programada, auditoria o base propia.

- `id`
- `sourceId`
- `startedAt`
- `finishedAt`
- `status`
- `productsRead`
- `productsUpdated`
- `productsRejected`
- `errors`

## Categorias iniciales

- `case`
- `cpu`
- `motherboard`
- `ram`
- `gpu`
- `psu`
- `storage`
- `cooler`

## Specs por categoria

### CPU

- `socket`
- `cores`
- `threads`
- `tdp`
- `baseClock`
- `boostClock`
- `memoryType`
- `includesCooler`

### Motherboard

- `socket`
- `formFactor`
- `ramType`
- `ramSlots`
- `maxRam`
- `chipset`
- `m2Slots`
- `pcieGeneration`

### RAM

- `type`
- `capacity`
- `modules`
- `frequency`
- `latency`

### GPU

- `lengthMm`
- `powerDraw`
- `vram`
- `pcieGeneration`
- `requiredPowerConnectors`

### PSU

- `wattage`
- `efficiency`
- `modular`
- `connectors`

### Case

- `supportedFormFactors`
- `maxGpuLengthMm`
- `maxAioSizeMm`
- `maxAirCoolerHeightMm`
- `color`

### Cooler

- `type`
- `compatibleSockets`
- `maxTdp`
- `aioSizeMm`
- `heightMm`

### Storage

- `type`
- `capacityGb`
- `interface`
- `readSpeed`
- `writeSpeed`

## Reglas de importacion

- Rechazar productos sin `id`/`externalId`, `name`, `category` o `price`.
- Marcar como incompleto cualquier producto sin specs criticas.
- No usar descripcion para decidir compatibilidad automaticamente.
- Guardar el dato original de tienda para auditoria si se transforma en una fase con persistencia.
- Incluir snapshot de precio/stock en cada solicitud comercial real.
- Persistir snapshots solo en una fase futura con backend/base propia.
- Revalidar precio/stock antes de enviar una solicitud real.
