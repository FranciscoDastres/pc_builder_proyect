# Instrucciones para agentes

Este repo contiene el armador de PC para Alltec. Antes de editar, lee:

1. `docs/product-vision.md`
2. `docs/architecture.md`
3. `docs/roadmap.md`
4. `docs/alltec-integration.md`

## Norte del MVP

El MVP/demo es un armador de PC con solicitud comercial simulada. No es checkout, no procesa pagos, no tiene carrito propio y no requiere PostgreSQL.

La app debe permitir que un cliente arme una PC compatible con productos mock/semi-reales de Alltec, vea precio/stock estimado y simule una solicitud. Si Alltec valida el producto, se integra una API o backend liviano para solicitudes reales.

## Reglas de trabajo

- Trabaja por bloques del roadmap.
- Mantén ownership claro de archivos o modulos.
- No edites archivos fuera del scope asignado.
- No reviertas cambios de otros agentes o del usuario.
- No acoples dominio ni UI directamente a Alltec; usa adaptadores.
- No asumas PostgreSQL como obligatorio; cualquier base de datos debe estar en fase futura o aprobada.
- No agregues reglas de compatibilidad dentro de componentes React.
- No uses scraping no autorizado como fuente oficial.
- Todo cambio en compatibilidad o datos requiere tests.

## Validacion esperada

Comandos base:

```bash
npm run build
npm run lint
```

Cuando existan tests, corre los tests relevantes. Para cambios UI importantes, agrega validacion visual o describe el camino de validacion.

## Reporte final minimo

Cada agente debe reportar:

- Objetivo abordado.
- Archivos cambiados.
- Validaciones corridas.
- Riesgos o follow-ups.
- Bloqueos si existen.

## Roles

La guia detallada vive en `docs/agents/`.

- Main agent: coordina, integra y valida el resultado final.
- Explorer: investiga sin editar.
- Worker: implementa dentro de ownership asignado.
- Tester: valida comandos, tests y flujos.
- Reviewer: revisa bugs, arquitectura, alcance y riesgos.
