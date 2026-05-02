# Guia para agentes

Esta carpeta define como deben trabajar agentes Codex, y otros asistentes si corresponde, dentro del proyecto.

## Documentos

- [Roles](./roles.md)
- [Workflow](./workflow.md)
- [Plantilla de tarea](./task-template.md)
- [Plantilla de handoff](./handoff-template.md)

## Fuentes de verdad

- Producto: `../product-vision.md`
- Arquitectura: `../architecture.md`
- Roadmap: `../roadmap.md`
- Integracion Alltec: `../alltec-integration.md`

Si hay conflicto, el roadmap define que se esta haciendo y arquitectura define como debe implementarse.

## Uso recomendado

1. El main agent toma un bloque del roadmap.
2. Decide si necesita subagentes.
3. Asigna ownership claro por archivos o modulos.
4. Workers implementan solo dentro de su scope.
5. Tester o reviewer valida si el cambio lo amerita.
6. El main agent integra y entrega resultado.

## Cuando no usar subagentes

- Cambios pequenos de un solo archivo.
- Tareas donde todos editarian los mismos archivos.
- Problemas urgentes donde el siguiente paso depende de exploracion local inmediata.
- Cambios de producto que todavia no estan decididos.
