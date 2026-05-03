# Documentacion del proyecto

Este directorio define la direccion de producto, arquitectura y trabajo operativo del armador de PC para Alltec.

## Lectura recomendada

1. [Vision del producto](./product-vision.md)
2. [Benchmarks](./benchmarks.md)
3. [UI/UX objetivo](./ui-ux.md)
4. [Arquitectura objetivo](./architecture.md)
5. [Integracion Alltec](./alltec-integration.md)
6. [Roadmap](./roadmap.md)
7. [Modelo de datos](./data-model.md)
8. [Reglas de compatibilidad](./compatibility-rules.md)
9. [Rendimiento](./performance.md)
10. [Guia para agentes](./agents/README.md)

## Estado actual

La aplicacion actual es un prototipo frontend en React, Vite y TypeScript. Permite seleccionar componentes, agregarlos a una build y validar algunas reglas basicas de compatibilidad en memoria.

Todavia no existe backend, base de datos, autenticacion, integracion con Alltec, administracion de catalogo ni solicitud comercial real.

## Norte del producto

El MVP/demo no es un ecommerce completo. Es un armador de PC independiente para Alltec que permite construir una PC compatible, ver precio/stock estimado y entregar un resumen claro de build. La solicitud comercial existe como accion secundaria y puede conectarse a un backend liviano o a una API acordada si Alltec valida el producto.

Checkout, pago online, carrito propio o integracion directa con el sitio Alltec quedan fuera del MVP y solo se agregan con una nueva decision documentada.

PostgreSQL no es requisito del MVP/demo. Queda como fase futura opcional para persistencia robusta, admin real, auditoria, snapshots y sincronizacion avanzada.

## Principio de trabajo

Antes de agregar nuevas pantallas, hay que separar dominio, datos y UI. El objetivo es que la app pueda pasar de un catalogo hardcodeado a productos reales de Alltec sin reescribir toda la experiencia.
