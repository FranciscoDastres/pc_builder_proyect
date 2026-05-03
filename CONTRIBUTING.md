# Guia de colaboracion

## Objetivo

Mantener el proyecto alineado para que personas y agentes puedan trabajar sin duplicar esfuerzos ni mezclar decisiones de arquitectura con cambios visuales.

## Fuentes de verdad

- Producto: `docs/product-vision.md`
- Arquitectura: `docs/architecture.md`
- Roadmap: `docs/roadmap.md`
- Integracion Alltec: `docs/alltec-integration.md`
- Agentes: `AGENTS.md` y `docs/agents/`

Si una decision cambia producto, arquitectura o roadmap, debe quedar reflejada en `docs/`.

## Flujo recomendado

1. Crear una rama por tarea.
2. Mantener los cambios pequenos y revisables.
3. Definir ownership de archivos antes de trabajar en paralelo.
4. Actualizar documentacion si cambia una decision tecnica o de producto.
5. Correr validaciones antes de compartir cambios.

## Comandos utiles

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Convencion de ramas

- `feature/nombre-corto`
- `fix/nombre-corto`
- `docs/nombre-corto`
- `refactor/nombre-corto`

## Definition of Done

Una tarea se considera lista cuando:

- La app compila.
- El lint pasa.
- El cambio respeta la arquitectura documentada.
- Hay tests si se modifica logica de compatibilidad o datos.
- La documentacion se actualizo si corresponde.
- Riesgos y follow-ups quedaron reportados.

## Reglas tecnicas

- No agregar reglas de compatibilidad directamente en componentes UI.
- No acoplar la pagina principal a una fuente de datos hardcodeada nueva.
- No acoplar dominio ni UI directamente a Alltec; usar adaptador.
- No implementar checkout, pago online ni carrito propio sin nueva decision documentada.
- No introducir PostgreSQL como requisito del MVP/demo sin nueva decision documentada.
- No usar scraping no autorizado como fuente oficial.
- No renderizar listas grandes completas.
- No usar texto libre para decidir compatibilidad.
- Preferir tipos estrictos y datos estructurados.
- Todo cambio en reglas de compatibilidad requiere tests.

## Proceso de revision

Al revisar un cambio, priorizar:

- Bugs o regresiones funcionales.
- Impacto en rendimiento.
- Coherencia con el modelo de datos.
- Claridad de la separacion dominio/datos/UI.
- Cumplimiento del MVP Alltec.
- Pruebas faltantes.

## Trabajo con agentes

Los agentes deben leer `AGENTS.md` antes de trabajar. Para tareas paralelas, el agente principal asigna ownership por archivos o modulos y luego integra los resultados.
