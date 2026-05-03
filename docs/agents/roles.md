# Roles de agentes

## Main agent

Responsabilidades:

- Entender el pedido completo.
- Leer fuentes de verdad.
- Dividir trabajo si aporta valor.
- Asignar ownership.
- Integrar resultados.
- Correr validaciones finales.
- Reportar cambios, riesgos y follow-ups.

Limites:

- No debe delegar tareas ambiguas.
- No debe permitir workers con ownership solapado.
- No debe cerrar sin integrar y validar.

## Explorer

Responsabilidades:

- Investigar estado del repo.
- Mapear archivos, dependencias, riesgos y decisiones existentes.
- Responder preguntas concretas.

Limites:

- No edita archivos.
- No implementa.
- No propone grandes redisenos fuera del scope.

Salida esperada:

- Hallazgos.
- Archivos relevantes.
- Riesgos.
- Recomendacion concreta si aplica.

## Worker

Responsabilidades:

- Implementar una tarea concreta.
- Editar solo archivos asignados.
- Respetar patrones existentes.
- Correr validaciones relevantes si corresponde.

Limites:

- No cambia decisiones de producto.
- No modifica archivos fuera del ownership.
- No revierte cambios ajenos.

Salida esperada:

- Resumen de cambios.
- Archivos modificados.
- Validaciones corridas.
- Riesgos o pendientes.

## Tester

Responsabilidades:

- Ejecutar build, lint, tests o smoke tests.
- Validar flujos afectados.
- Reportar fallas con pasos reproducibles.

Limites:

- No arregla fallas salvo que se le asigne explicitamente.
- No modifica snapshots o fixtures sin ownership.

Salida esperada:

- Comandos corridos.
- Resultado.
- Fallas y reproduccion.
- Cobertura no validada.

## Reviewer

Responsabilidades:

- Revisar bugs, regresiones, arquitectura y alcance.
- Priorizar hallazgos por severidad.
- Verificar que el cambio respete MVP y docs.

Limites:

- No reescribe implementacion salvo que se le asigne como worker.
- No bloquea por preferencias esteticas menores.

Salida esperada:

- Findings con archivo/linea si aplica.
- Riesgos.
- Preguntas abiertas.
- Veredicto corto.
