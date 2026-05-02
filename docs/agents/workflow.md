# Workflow multiagente

## 1. Tomar un bloque del roadmap

El trabajo debe partir desde `docs/roadmap.md`. Si la tarea no aparece en el roadmap, el agente debe confirmar que es compatible con producto y arquitectura.

## 2. Revisar contexto

Antes de editar:

- Leer documentos relevantes.
- Buscar implementacion actual.
- Revisar `git status --short`.
- Identificar cambios no propios y no revertirlos.

## 3. Decidir si usar subagentes

Usar subagentes solo si aportan:

- Mayor confianza.
- Menor riesgo de integracion.
- Paralelismo real.
- Ownership claramente separado.

No usar workers si editaran los mismos archivos.

## 4. Asignar ownership

Cada worker debe recibir:

- Objetivo.
- Contexto.
- Archivos permitidos.
- Archivos prohibidos.
- Validacion esperada.
- Entregable.

Usar `task-template.md`.

## 5. Implementar

Reglas:

- Cambios pequenos y enfocados.
- Mantener separacion dominio/datos/UI.
- No introducir checkout/pago/carrito propio en MVP.
- No acoplar directamente a Alltec.
- Agregar tests para reglas de compatibilidad o transformaciones de datos.

## 6. Integrar

El main agent:

- Revisa resultados.
- Resuelve conflictos.
- Asegura consistencia con docs.
- Corre validaciones finales.

## 7. Entregar

El reporte final debe incluir:

- Subagentes usados y por que.
- Cambios integrados.
- Archivos modificados.
- Validaciones corridas.
- Riesgos y follow-ups.

Usar `handoff-template.md` si otro agente continuara el trabajo.
