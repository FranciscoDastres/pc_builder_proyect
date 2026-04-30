interface Props {
  caseId: string
  size?: 'sm' | 'lg'
}

export function CaseIllustration({ caseId, size = 'sm' }: Props) {
  const w = size === 'lg' ? 140 : 56
  const h = size === 'lg' ? 210 : 84

  const svg = illustrations[caseId]
  if (!svg) return <span style={{ fontSize: size === 'lg' ? 48 : 24 }}>🖥️</span>

  return (
    <svg
      viewBox={svg.viewBox}
      width={w}
      height={h}
      style={{ display: 'block', overflow: 'visible' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {svg.content}
    </svg>
  )
}

// ---------- SVG Illustrations ----------

const illustrations: Record<string, { viewBox: string; content: React.ReactNode }> = {

  // Lian Li PC-O11 Dynamic EVO XL — Full ATX, black, dual chamber, large glass
  'case-001': {
    viewBox: '0 0 80 130',
    content: (
      <>
        <defs>
          <radialGradient id="rgb001" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
          </radialGradient>
          <filter id="glow001">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Body */}
        <rect x="4" y="4" width="72" height="122" rx="3" fill="#0d0d0f" stroke="#2a2a35" strokeWidth="1.2" />
        {/* Front panel top strip */}
        <rect x="4" y="4" width="72" height="8" rx="3" fill="#111118" />
        {/* Glass panel (large) */}
        <rect x="11" y="14" width="54" height="88" rx="2" fill="rgba(140,200,255,0.04)" stroke="rgba(140,200,255,0.18)" strokeWidth="0.8" />
        {/* Internal glow */}
        <rect x="14" y="17" width="48" height="82" rx="1" fill="url(#rgb001)" />
        {/* AIO / fan top row — 3 fans at top */}
        {[20, 40, 60].map(cx => (
          <g key={cx}>
            <circle cx={cx} cy="38" r="10" fill="none" stroke="rgba(124,58,237,0.35)" strokeWidth="1" />
            <circle cx={cx} cy="38" r="3.5" fill="rgba(124,58,237,0.25)" />
            <line x1={cx} y1="28" x2={cx} y2="48" stroke="rgba(124,58,237,0.2)" strokeWidth="0.6" />
            <line x1={cx - 10} y1="38" x2={cx + 10} y2="38" stroke="rgba(124,58,237,0.2)" strokeWidth="0.6" />
            <line x1={cx - 7} y1="31" x2={cx + 7} y2="45" stroke="rgba(124,58,237,0.15)" strokeWidth="0.6" />
            <line x1={cx + 7} y1="31" x2={cx - 7} y2="45" stroke="rgba(124,58,237,0.15)" strokeWidth="0.6" />
          </g>
        ))}
        {/* Motherboard silhouette */}
        <rect x="15" y="52" width="46" height="38" rx="1" fill="rgba(30,30,60,0.6)" stroke="rgba(80,80,140,0.3)" strokeWidth="0.6" />
        {/* PCIe slots on mobo */}
        <rect x="17" y="68" width="30" height="2.5" rx="0.5" fill="rgba(100,100,200,0.3)" />
        <rect x="17" y="73" width="30" height="2.5" rx="0.5" fill="rgba(100,100,200,0.2)" />
        <rect x="17" y="78" width="20" height="2.5" rx="0.5" fill="rgba(100,100,200,0.15)" />
        {/* GPU in mobo */}
        <rect x="17" y="60" width="40" height="6" rx="1" fill="rgba(60,60,120,0.5)" stroke="rgba(120,120,220,0.3)" strokeWidth="0.5" />
        {/* Dual chamber divider */}
        <line x1="11" y1="103" x2="65" y2="103" stroke="#222230" strokeWidth="1.2" />
        {/* PSU area bottom */}
        <rect x="14" y="105" width="48" height="14" rx="1" fill="#0a0a0d" stroke="#1e1e28" strokeWidth="0.6" />
        <rect x="18" y="108" width="16" height="8" rx="0.5" fill="#0d0d12" stroke="#2a2a38" strokeWidth="0.5" />
        {/* RGB strip bottom of glass */}
        <rect x="11" y="100" width="54" height="2" rx="1" fill="rgba(139,92,246,0.7)" filter="url(#glow001)" />
        {/* RGB strip at base */}
        <rect x="4" y="122" width="72" height="3" rx="1.5" fill="rgba(139,92,246,0.5)" />
        {/* Power button */}
        <circle cx="68" cy="8" r="3" fill="#1a1a22" stroke="#333" strokeWidth="0.7" />
        <circle cx="68" cy="8" r="1.5" fill="rgba(139,92,246,0.9)" filter="url(#glow001)" />
        {/* USB ports top */}
        <rect x="10" y="6" width="6" height="3.5" rx="0.5" fill="#111118" stroke="#333" strokeWidth="0.4" />
        <rect x="18" y="6" width="6" height="3.5" rx="0.5" fill="#111118" stroke="#333" strokeWidth="0.4" />
        {/* Bottom vents */}
        {[8, 14, 20, 26, 32, 38, 44, 50, 56, 62, 68].map(x => (
          <line key={x} x1={x} y1="125" x2={x} y2="128" stroke="#1a1a22" strokeWidth="1" />
        ))}
      </>
    ),
  },

  // Fractal Design Torrent Compact — mATX, black, mesh front, understated
  'case-002': {
    viewBox: '0 0 80 110',
    content: (
      <>
        <defs>
          <radialGradient id="rgb002" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>
          <pattern id="mesh002" x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="0.7" fill="rgba(255,255,255,0.08)" />
          </pattern>
        </defs>
        {/* Body */}
        <rect x="4" y="4" width="72" height="102" rx="3" fill="#0e0e10" stroke="#252530" strokeWidth="1.2" />
        {/* Top strip */}
        <rect x="4" y="4" width="72" height="7" rx="3" fill="#131318" />
        {/* Mesh front panel (large bottom-to-top mesh) */}
        <rect x="8" y="13" width="28" height="82" rx="1.5" fill="#080809" stroke="#1e1e28" strokeWidth="0.8" />
        <rect x="9" y="14" width="26" height="80" rx="1" fill="url(#mesh002)" />
        {/* Large 180mm intake fan through mesh */}
        <circle cx="22" cy="54" r="16" fill="none" stroke="rgba(6,182,212,0.25)" strokeWidth="1" />
        <circle cx="22" cy="54" r="5" fill="rgba(6,182,212,0.15)" />
        {[0, 45, 90, 135].map(a => {
          const rad = (a * Math.PI) / 180
          return (
            <line key={a}
              x1={22 + 5 * Math.cos(rad)} y1={54 + 5 * Math.sin(rad)}
              x2={22 + 15 * Math.cos(rad)} y2={54 + 15 * Math.sin(rad)}
              stroke="rgba(6,182,212,0.2)" strokeWidth="0.7"
            />
          )
        })}
        {/* Side panel — glass */}
        <rect x="38" y="13" width="34" height="82" rx="1.5" fill="rgba(140,200,255,0.04)" stroke="rgba(140,200,255,0.15)" strokeWidth="0.8" />
        {/* Internal glow */}
        <rect x="40" y="15" width="30" height="78" rx="1" fill="url(#rgb002)" />
        {/* Mobo through glass */}
        <rect x="41" y="18" width="26" height="40" rx="1" fill="rgba(20,30,50,0.7)" stroke="rgba(6,182,212,0.2)" strokeWidth="0.5" />
        {/* GPU */}
        <rect x="41" y="36" width="24" height="10" rx="1" fill="rgba(10,40,60,0.8)" stroke="rgba(6,182,212,0.3)" strokeWidth="0.5" />
        {/* RAM sticks */}
        <rect x="55" y="19" width="3" height="15" rx="0.5" fill="rgba(6,182,212,0.4)" />
        <rect x="59" y="19" width="3" height="15" rx="0.5" fill="rgba(6,182,212,0.4)" />
        {/* Cooler tower */}
        <rect x="44" y="18" width="10" height="17" rx="1" fill="rgba(40,60,80,0.8)" stroke="rgba(6,182,212,0.2)" strokeWidth="0.5" />
        {/* PSU bottom */}
        <rect x="38" y="97" width="34" height="10" rx="1" fill="rgba(8,8,12,0.9)" stroke="#1e1e28" strokeWidth="0.6" />
        {/* Bottom intake vents */}
        {[8, 14, 20, 26, 32, 38, 44, 50, 56, 62, 68].map(x => (
          <rect key={x} x={x} y="100" width="4" height="5" rx="0.5" fill="#0a0a0c" stroke="#1e1e28" strokeWidth="0.4" />
        ))}
        {/* Power btn */}
        <circle cx="68" cy="7.5" r="2.5" fill="#1a1a22" stroke="#333" strokeWidth="0.6" />
        <circle cx="68" cy="7.5" r="1.2" fill="rgba(6,182,212,0.9)" />
        {/* USB */}
        <rect x="10" y="6" width="5" height="3" rx="0.5" fill="#111118" stroke="#2a2a38" strokeWidth="0.4" />
        <rect x="16" y="6" width="5" height="3" rx="0.5" fill="#111118" stroke="#2a2a38" strokeWidth="0.4" />
        {/* Fractal logo area */}
        <rect x="13" y="92" width="12" height="1.5" rx="0.7" fill="rgba(255,255,255,0.1)" />
      </>
    ),
  },

  // NZXT H9 Flow White — Full ATX, white, panoramic 270° glass
  'case-003': {
    viewBox: '0 0 80 130',
    content: (
      <>
        <defs>
          <radialGradient id="rgb003" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#f0abfc" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#818cf8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <filter id="glow003">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* White body */}
        <rect x="4" y="4" width="72" height="122" rx="4" fill="#e8e8ec" stroke="#c8c8d0" strokeWidth="1" />
        {/* Top connector bar */}
        <rect x="4" y="4" width="72" height="10" rx="4" fill="#f0f0f4" stroke="#c8c8d0" strokeWidth="1" />
        {/* Panoramic glass — left, front, right sides combined */}
        <rect x="8" y="15" width="64" height="96" rx="3" fill="rgba(200,230,255,0.12)" stroke="rgba(180,210,255,0.4)" strokeWidth="0.8" />
        {/* Internal glow — pink/purple */}
        <rect x="10" y="17" width="60" height="92" rx="2" fill="url(#rgb003)" />
        {/* Mobo */}
        <rect x="14" y="22" width="48" height="52" rx="2" fill="rgba(30,20,60,0.25)" stroke="rgba(200,150,255,0.25)" strokeWidth="0.6" />
        {/* CPU cooler — single tower + AIO radiator style */}
        <rect x="22" y="24" width="22" height="24" rx="2" fill="rgba(60,40,100,0.3)" stroke="rgba(200,150,255,0.3)" strokeWidth="0.5" />
        {/* Fan on AIO */}
        <circle cx="33" cy="36" r="9" fill="none" stroke="rgba(200,150,255,0.3)" strokeWidth="0.8" />
        <circle cx="33" cy="36" r="3" fill="rgba(200,150,255,0.2)" />
        <line x1="33" y1="27" x2="33" y2="45" stroke="rgba(200,150,255,0.2)" strokeWidth="0.5" />
        <line x1="24" y1="36" x2="42" y2="36" stroke="rgba(200,150,255,0.2)" strokeWidth="0.5" />
        {/* GPU */}
        <rect x="16" y="56" width="42" height="12" rx="1.5" fill="rgba(30,20,80,0.35)" stroke="rgba(180,150,255,0.3)" strokeWidth="0.5" />
        <circle cx="22" cy="62" r="3.5" fill="none" stroke="rgba(180,150,255,0.25)" strokeWidth="0.5" />
        <circle cx="30" cy="62" r="3.5" fill="none" stroke="rgba(180,150,255,0.25)" strokeWidth="0.5" />
        {/* RAM */}
        <rect x="48" y="23" width="3" height="18" rx="0.5" fill="rgba(240,170,255,0.5)" />
        <rect x="52" y="23" width="3" height="18" rx="0.5" fill="rgba(240,170,255,0.5)" />
        {/* Bottom cable management */}
        <rect x="8" y="113" width="64" height="12" rx="2" fill="#dcdce4" stroke="#c0c0c8" strokeWidth="0.6" />
        {/* RGB strip */}
        <rect x="8" y="111" width="64" height="1.5" rx="0.7" fill="rgba(240,130,255,0.6)" filter="url(#glow003)" />
        {/* Power button — minimal circle */}
        <circle cx="40" cy="8" r="3.5" fill="white" stroke="#c0c0c8" strokeWidth="0.8" />
        <circle cx="40" cy="8" r="1.5" fill="rgba(200,150,255,0.8)" />
        {/* Top USB — minimal */}
        <rect x="52" y="6" width="5" height="3.5" rx="0.5" fill="#e0e0e8" stroke="#c0c0c8" strokeWidth="0.4" />
        <rect x="58" y="6" width="5" height="3.5" rx="0.5" fill="#e0e0e8" stroke="#c0c0c8" strokeWidth="0.4" />
        {/* Bottom vents */}
        {[10, 17, 24, 31, 38, 45, 52, 59, 66].map(x => (
          <rect key={x} x={x} y="122" width="5" height="3" rx="0.5" fill="#d8d8e0" />
        ))}
        {/* NZXT text */}
        <rect x="30" y="105" width="20" height="1.5" rx="0.7" fill="rgba(0,0,0,0.08)" />
      </>
    ),
  },

  // Cooler Master HAF 700 EVO — Full Tower, black, aggressive, ARGB display
  'case-004': {
    viewBox: '0 0 80 130',
    content: (
      <>
        <defs>
          <radialGradient id="rgb004" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <filter id="glow004">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
          <pattern id="topmesh" x="0" y="0" width="2.5" height="2.5" patternUnits="userSpaceOnUse">
            <circle cx="1.25" cy="1.25" r="0.6" fill="rgba(255,255,255,0.07)" />
          </pattern>
        </defs>
        {/* Main body — slightly wider feel */}
        <rect x="3" y="4" width="74" height="122" rx="2" fill="#080809" stroke="#1a1a20" strokeWidth="1.5" />
        {/* Top mesh panel */}
        <rect x="3" y="4" width="74" height="18" rx="2" fill="#0c0c0e" stroke="#222" strokeWidth="0.8" />
        <rect x="5" y="6" width="70" height="14" rx="1" fill="url(#topmesh)" />
        {/* Top 3 fans visible through mesh */}
        {[16, 40, 64].map(cx => (
          <g key={cx}>
            <circle cx={cx} cy="13" r="7" fill="none" stroke="rgba(249,115,22,0.3)" strokeWidth="0.8" />
            <circle cx={cx} cy="13" r="2.5" fill="rgba(249,115,22,0.2)" />
            <line x1={cx} y1="6" x2={cx} y2="20" stroke="rgba(249,115,22,0.15)" strokeWidth="0.5" />
            <line x1={cx - 7} y1="13" x2={cx + 7} y2="13" stroke="rgba(249,115,22,0.15)" strokeWidth="0.5" />
          </g>
        ))}
        {/* Front ARGB display strip */}
        <rect x="3" y="22" width="8" height="80" rx="1" fill="#0e0e12" stroke="#222" strokeWidth="0.6" />
        <rect x="4" y="25" width="6" height="74" rx="0.5" fill="rgba(249,115,22,0.15)" />
        {/* OLED/ARGB segments */}
        {[0, 12, 24, 36, 48, 60].map(y => (
          <rect key={y} x="4.5" y={26 + y} width="5" height="9" rx="0.3"
            fill={`rgba(${y < 30 ? '249,115,22' : '139,92,246'},${0.3 + y * 0.003})`} />
        ))}
        {/* Side glass panel */}
        <rect x="13" y="22" width="62" height="84" rx="1.5" fill="rgba(140,200,255,0.04)" stroke="rgba(140,200,255,0.15)" strokeWidth="0.8" />
        {/* Internal glow */}
        <rect x="15" y="24" width="58" height="80" rx="1" fill="url(#rgb004)" />
        {/* Mobo */}
        <rect x="18" y="28" width="50" height="50" rx="1.5" fill="rgba(20,15,40,0.7)" stroke="rgba(120,80,200,0.25)" strokeWidth="0.5" />
        {/* GPU — thick, 3 fan */}
        <rect x="18" y="58" width="48" height="14" rx="1.5" fill="rgba(30,20,60,0.9)" stroke="rgba(139,92,246,0.4)" strokeWidth="0.7" />
        {[26, 38, 50].map(cx => (
          <circle key={cx} cx={cx} cy="65" r="4.5" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="0.7" />
        ))}
        {/* CPU cooler */}
        <rect x="28" y="29" width="18" height="22" rx="1" fill="rgba(40,30,80,0.8)" stroke="rgba(139,92,246,0.3)" strokeWidth="0.5" />
        {/* Heatsink fins */}
        {[30, 32, 34, 36, 38, 40, 42, 44].map(x => (
          <line key={x} x1={x} y1="30" x2={x} y2="50" stroke="rgba(139,92,246,0.15)" strokeWidth="0.5" />
        ))}
        {/* RAM */}
        <rect x="48" y="29" width="3" height="16" rx="0.5" fill="rgba(249,115,22,0.5)" />
        <rect x="52" y="29" width="3" height="16" rx="0.5" fill="rgba(249,115,22,0.5)" />
        <rect x="56" y="29" width="3" height="16" rx="0.5" fill="rgba(249,115,22,0.5)" />
        <rect x="60" y="29" width="3" height="16" rx="0.5" fill="rgba(249,115,22,0.5)" />
        {/* Bottom PSU */}
        <rect x="13" y="107" width="62" height="15" rx="1" fill="#060608" stroke="#1a1a20" strokeWidth="0.8" />
        {/* RGB bottom */}
        <rect x="13" y="106" width="62" height="1.5" rx="0.7" fill="rgba(249,115,22,0.6)" />
        {/* Power button */}
        <rect x="58" y="5" width="12" height="5" rx="1" fill="#111118" stroke="#2a2a35" strokeWidth="0.5" />
        <rect x="60" y="6.5" width="4" height="2" rx="0.5" fill="rgba(249,115,22,0.8)" />
        {/* Bottom vents */}
        {[6, 13, 20, 27, 34, 41, 48, 55, 62, 69].map(x => (
          <rect key={x} x={x} y="122" width="5" height="4" rx="0.4" fill="#0a0a0c" stroke="#1a1a22" strokeWidth="0.3" />
        ))}
      </>
    ),
  },

  // Silverstone SUGO 17 ITX — Small Form Factor, compact cube
  'case-005': {
    viewBox: '0 0 80 80',
    content: (
      <>
        <defs>
          <radialGradient id="rgb005" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>
          <pattern id="vent005" x="0" y="0" width="3.5" height="3.5" patternUnits="userSpaceOnUse">
            <rect x="0.5" y="0.5" width="2" height="1" rx="0.4" fill="rgba(255,255,255,0.06)" />
          </pattern>
        </defs>
        {/* Main cube body */}
        <rect x="5" y="8" width="70" height="65" rx="3" fill="#0c0c10" stroke="#222230" strokeWidth="1.2" />
        {/* Top panel */}
        <rect x="5" y="8" width="70" height="10" rx="3" fill="#111118" stroke="#222230" strokeWidth="1" />
        {/* Top vent/mesh */}
        <rect x="12" y="10" width="56" height="6" rx="1" fill="url(#vent005)" />
        {/* Top fan visible */}
        <circle cx="40" cy="13" r="4.5" fill="none" stroke="rgba(34,211,238,0.3)" strokeWidth="0.8" />
        <circle cx="40" cy="13" r="1.5" fill="rgba(34,211,238,0.2)" />
        {/* Side glass panel */}
        <rect x="9" y="20" width="62" height="48" rx="2" fill="rgba(140,220,255,0.05)" stroke="rgba(140,220,255,0.2)" strokeWidth="0.7" />
        {/* Internal glow */}
        <rect x="11" y="22" width="58" height="44" rx="1" fill="url(#rgb005)" />
        {/* ITX mobo — small */}
        <rect x="14" y="25" width="32" height="32" rx="1.5" fill="rgba(20,30,50,0.7)" stroke="rgba(34,211,238,0.25)" strokeWidth="0.5" />
        {/* CPU + small cooler */}
        <rect x="18" y="28" width="12" height="12" rx="1" fill="rgba(30,60,80,0.8)" stroke="rgba(34,211,238,0.35)" strokeWidth="0.5" />
        <circle cx="24" cy="34" r="4.5" fill="none" stroke="rgba(34,211,238,0.3)" strokeWidth="0.7" />
        <circle cx="24" cy="34" r="1.5" fill="rgba(34,211,238,0.2)" />
        {/* RAM — 2 sticks */}
        <rect x="33" y="26" width="3" height="12" rx="0.5" fill="rgba(34,211,238,0.5)" />
        <rect x="37" y="26" width="3" height="12" rx="0.5" fill="rgba(34,211,238,0.5)" />
        {/* GPU — compact */}
        <rect x="48" y="26" width="18" height="28" rx="1.5" fill="rgba(10,40,60,0.8)" stroke="rgba(34,211,238,0.3)" strokeWidth="0.5" />
        <circle cx="53" cy="36" r="5" fill="none" stroke="rgba(34,211,238,0.25)" strokeWidth="0.7" />
        <circle cx="61" cy="36" r="5" fill="none" stroke="rgba(34,211,238,0.25)" strokeWidth="0.7" />
        {/* Side vents */}
        <rect x="5" y="24" width="4" height="36" rx="1" fill="#0a0a0e" />
        {[26, 30, 34, 38, 42, 46, 50, 54].map(y => (
          <rect key={y} x="5.5" y={y} width="2.5" height="2" rx="0.3" fill="#151520" />
        ))}
        {/* RGB bottom edge */}
        <rect x="5" y="70" width="70" height="2" rx="1" fill="rgba(34,211,238,0.5)" />
        {/* Power button */}
        <circle cx="70" cy="13" r="3" fill="#111118" stroke="#2a2a38" strokeWidth="0.6" />
        <circle cx="70" cy="13" r="1.4" fill="rgba(34,211,238,0.9)" />
        {/* USB */}
        <rect x="12" y="11" width="5" height="3.5" rx="0.5" fill="#0d0d14" stroke="#222" strokeWidth="0.4" />
        <rect x="18" y="11" width="5" height="3.5" rx="0.5" fill="#0d0d14" stroke="#222" strokeWidth="0.4" />
        {/* Bottom feet */}
        {[10, 60].map(x => (
          <rect key={x} x={x} y="72" width="10" height="5" rx="1.5" fill="#0a0a0c" stroke="#1a1a22" strokeWidth="0.5" />
        ))}
      </>
    ),
  },
}
