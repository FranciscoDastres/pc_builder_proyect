# Roadmap

## Fase 0: Ordenar el prototipo

Objetivo: dejar una base clara para seguir trabajando sin romper funcionalidad.

- [x] Separar reglas de compatibilidad desde hooks React a funciones puras.
- [x] Agregar tests unitarios para compatibilidad.
- [x] Crear un servicio de catalogo mock en vez de importar `allProducts` directo en la pagina.
- [x] Definir filtros minimos por categoria.
- [x] Agregar estados de carga, vacio y error.
- [x] Cambiar el cierre conceptual desde "comprar build" hacia "solicitar armado".

Resultado esperado: la app sigue funcionando igual, pero el dominio queda testeable y desacoplado.

## Fase 1: Catalogo escalable y mock Alltec

Objetivo: soportar 1000 a 10000 productos sin degradar la UI y preparar datos cercanos al caso Alltec.

- [x] Crear fixture/mock inicial con categorias equivalentes a Alltec.
- [ ] Agregar paginacion o infinite scroll.
- [x] Virtualizar el listado de productos.
- [x] Memoizar agrupacion, busqueda y filtros.
- [x] Evitar calcular compatibilidad para productos fuera de pantalla.
- [ ] Medir rendimiento con catalogo mock grande.

Resultado esperado: busqueda y navegacion fluidas con miles de productos.

## Fase 2: Solicitud comercial mock

Objetivo: demostrar el cierre del flujo sin base de datos ni integracion real.

- [x] Crear formulario de contacto minimo.
- [x] Validar build antes de simular envio.
- [x] Preparar payload de solicitud con snapshot de productos, precio y stock.
- [x] Mostrar confirmacion al cliente.
- [x] Mantener la solicitud como mock sin persistencia.

Resultado esperado: Alltec puede ver el flujo completo de armado y solicitud sin infraestructura adicional.

## Fase 3: Integracion API Alltec sin base propia

Objetivo: consumir datos reales o semi-reales de Alltec mediante adaptador, sin crear una base de datos propia.

- [x] Definir adaptador de productos Alltec.
- [x] Mapear categorias Alltec a slots del armador.
- [x] Normalizar precio, stock, imagen, URL y specs.
- [x] Cachear catalogo solo como optimizacion no autoritativa.
- [x] Revalidar precio/stock antes de enviar solicitud.

Resultado esperado: el catalogo del armador refleja datos de Alltec sin acoplar la UI ni requerir PostgreSQL.

## Fase 4: Backend liviano para solicitudes reales

Objetivo: enviar solicitudes reales sin incorporar todavia una base de datos robusta.

- [ ] Crear endpoint minimo para recibir solicitud.
- [ ] Enviar solicitud por email, API o canal acordado con Alltec.
- [ ] Revalidar precio/stock antes del envio.
- [ ] Incluir snapshot de productos, precio y stock en el mensaje.
- [ ] Manejar errores de envio y mostrar estado claro al cliente.

Resultado esperado: el usuario puede solicitar una PC armada y Alltec recibe la informacion necesaria para contactar.

## Fase futura: PostgreSQL + admin persistente

Objetivo: agregar persistencia robusta cuando Alltec valide el producto y se necesite operacion real.

- [ ] Crear backend TypeScript con NestJS si el alcance lo requiere.
- [ ] Configurar PostgreSQL y Prisma.
- [ ] Persistir solicitudes comerciales.
- [ ] Guardar snapshots de precio/stock.
- [ ] Agregar login admin/vendedor.
- [ ] Listar solicitudes recibidas.
- [ ] Ver detalle de build y advertencias.
- [ ] Revisar productos importados con specs incompletas.
- [ ] Registrar logs de sincronizacion.
- [ ] Activar/desactivar productos en el armador si corresponde.

Resultado esperado: Alltec puede operar solicitudes, auditar datos y mejorar calidad del catalogo.

## Fase futura: Integracion profunda Alltec

Objetivo: extender el producto si Alltec valida el MVP.

- [ ] Integracion con carrito Alltec.
- [ ] Integracion con pago online.
- [ ] Embebido dentro del sitio Alltec.
- [ ] Recomendaciones automaticas por presupuesto/uso.
- [ ] Compartir builds por URL.
- [ ] Comparar alternativas compatibles.

Resultado esperado: el armador se convierte en parte del flujo comercial completo.
