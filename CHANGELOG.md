# Changelog

Historial de cambios del proyecto PC Builder Alltec. Los commits están agrupados por fase de desarrollo.

---

## [main] — 2026-05-02

### PR #1: Integración catálogo Alltec y flujo de solicitud

| Commit | Descripción |
|--------|-------------|
| `a99a3dd` | Merge pull request #1 desde `develop_manuel` |
| `66fc858` | Actualización README.md con estado actual y comandos |
| `b9376c3` | Implementa catálogo demo Alltec y flujo de solicitud comercial mock |
| `e415731` | Docs: define roadmap MVP del PC Builder |
| `55d9f3d` | Docs: define roadmap general y flujo del agente |

---

## [develop_manuel] — 2026-04-30

### Refactor de arquitectura y routing

| Commit | Descripción |
|--------|-------------|
| `33d69a2` | Agrega DOM al proyecto |
| `a0308be` | `src/hooks/` — imports apuntan a `../../../types` |
| `5a3cb24` | `src/components/` — imports actualizados a `types` y `data/products` |
| `ceab5ce` | `src/components/` — imports apuntan a `../../../types` |
| `d1c2075` | Routing con react-router-dom; ruta `/` apunta a `Home` |
| `43d0599` | Lógica del builder extraída de `App.tsx` (estado, drag & drop, layout) |
| `bdb60a2` | Agrega dependencia `react-router-dom` |
| `dca87fc` | `App.tsx` reemplazado por estructura más escalable |
| `7586485` | `src/components/` sin cambios de imports (paso intermedio) |
| `67afc01` | `src/components/` — imports actualizados a `../../../types` |
| `c38f471` | `Header` extraído de `App.tsx`; recibe `filledCount` y `totalPrice` como props |
| `e7c958d` | `App.tsx` queda como thin wrapper: solo `BrowserRouter` + `AppRoutes` |
| `ba510e3` | Usa `slotOrder` de `products.ts` para que "Tu Build" mantenga el orden del catálogo |

### Diseño visual y UI

| Commit | Descripción |
|--------|-------------|
| `e7805a5` | Creación de piezas en modo espejo (izquierda / derecha) |
| `b9d826f` | Fondo claro, tabs con borde estilo e-commerce, input blanco con ring azul |
| `731c127` | Cards blancas con sombra, precio en rojo bold, badge diagonal "EN BUILD", botón azul |
| `079ea16` | Slots blancos con bordes verdes/rojos/azul, header gabinete en blanco |
| `85d9c97` | Card blanca, barra de progreso azul, precio rojo, botón azul, alertas en colores suaves |
| `d6b4b4c` | Header blanco con "ALLTEC" negro bold + subtítulo, barra nav oscura estilo Alltec |
| `0cd1d4d` | Fondo blanco/gris claro, animaciones azul, scrollbar gris |

---

## [develop] — 2026-04-29

### Setup inicial y primeras iteraciones visuales

| Commit | Descripción |
|--------|-------------|
| `ad75b59` | Color `violet` → `sky` en input focus y tabs activos |
| `8d69ede` | Color `violet` → `sky` en bordes, precio y botón |
| `989646a` | Estilos inline `style={{...}}` migrados a clases Tailwind |
| `a8b70ac` | Animación glow `violet` → `sky blue` |
| `b8fe07b` | Agrega `useDroppable` al gabinete + `useDraggable` en slots con producto |
| `4ad5446` | Agrega `useDroppable` al gabinete + `useDraggable` en slots con producto (paso previo) |
| `0dabfab` | First commit |
| `34d3112` | Commit inicial — proyecto PC Builder |
