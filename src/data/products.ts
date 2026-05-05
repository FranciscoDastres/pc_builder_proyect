import type {
  CaseProduct, CPUProduct, MotherboardProduct,
  RAMProduct, GPUProduct, PSUProduct, StorageProduct, CoolerProduct, Product
} from '../types'

export const cases: CaseProduct[] = [
  {
    id: 'case-001', slot: 'case', brand: 'Lian Li', name: 'PC-O11 Dynamic EVO XL',
    price: 189, image: '🖥️', inStock: true, powerDraw: 0,
    description: 'Full Tower ATX con panel de vidrio templado, doble cámara',
    formFactors: ['ATX', 'mATX'], maxAIOSize: 360, maxGPULength: 446,
    sidePanel: 'glass', color: 'black',
  },
  {
    id: 'case-002', slot: 'case', brand: 'Fractal Design', name: 'Torrent Compact',
    price: 159, image: '🖥️', inStock: true, powerDraw: 0,
    description: 'mATX con flujo de aire optimizado y panel de vidrio',
    formFactors: ['mATX', 'ITX'], maxAIOSize: 280, maxGPULength: 380,
    sidePanel: 'glass', color: 'black',
  },
  {
    id: 'case-003', slot: 'case', brand: 'NZXT', name: 'H9 Flow White',
    price: 199, image: '🖥️', inStock: true, powerDraw: 0,
    description: 'Full Tower doble cámara con panel panorámico 270°',
    formFactors: ['ATX', 'mATX'], maxAIOSize: 360, maxGPULength: 435,
    sidePanel: 'glass', color: 'white',
  },
  {
    id: 'case-004', slot: 'case', brand: 'Cooler Master', name: 'HAF 700 EVO',
    price: 349, image: '🖥️', inStock: true, powerDraw: 0,
    description: 'Full Tower ultra gamer con display ARGB y E-ATX',
    formFactors: ['ATX'], maxAIOSize: 360, maxGPULength: 500,
    sidePanel: 'glass', color: 'black',
  },
  {
    id: 'case-005', slot: 'case', brand: 'Silverstone', name: 'SUGO 17 ITX',
    price: 139, image: '🖥️', inStock: true, powerDraw: 0,
    description: 'Mini-ITX compacto, perfecto para builds portátiles',
    formFactors: ['ITX'], maxAIOSize: 240, maxGPULength: 330,
    sidePanel: 'glass', color: 'black',
  },
]

export const cpus: CPUProduct[] = [
  {
    id: 'cpu-001', slot: 'cpu', brand: 'AMD', name: 'Ryzen 7 9800X3D',
    price: 479, image: '🔲', inStock: true, powerDraw: 120,
    description: 'El rey de gaming con 3D V-Cache de segunda gen, 8 núcleos AM5',
    socket: 'AM5', cores: 8, threads: 16, baseClock: 4.7, boostClock: 5.2,
    tdp: 120, generation: 'Zen 5', includesCooler: false,
  },
  {
    id: 'cpu-002', slot: 'cpu', brand: 'AMD', name: 'Ryzen 9 9950X',
    price: 649, image: '🔲', inStock: true, powerDraw: 170,
    description: '16 núcleos Zen 5, monstruo de productividad y gaming AM5',
    socket: 'AM5', cores: 16, threads: 32, baseClock: 4.3, boostClock: 5.7,
    tdp: 170, generation: 'Zen 5', includesCooler: false,
  },
  {
    id: 'cpu-003', slot: 'cpu', brand: 'AMD', name: 'Ryzen 5 9600X',
    price: 279, image: '🔲', inStock: true, powerDraw: 65,
    description: '6 núcleos Zen 5, la mejor relación precio-desempeño AM5',
    socket: 'AM5', cores: 6, threads: 12, baseClock: 3.9, boostClock: 5.4,
    tdp: 65, generation: 'Zen 5', includesCooler: false,
  },
  {
    id: 'cpu-004', slot: 'cpu', brand: 'Intel', name: 'Core Ultra 9 285K',
    price: 589, image: '🔲', inStock: true, powerDraw: 253,
    description: '24 núcleos Arrow Lake, máxima potencia Intel LGA1851',
    socket: 'LGA1851', cores: 24, threads: 24, baseClock: 3.7, boostClock: 5.7,
    tdp: 253, generation: 'Arrow Lake', includesCooler: false,
  },
  {
    id: 'cpu-005', slot: 'cpu', brand: 'Intel', name: 'Core Ultra 7 265K',
    price: 394, image: '🔲', inStock: true, powerDraw: 125,
    description: '20 núcleos Arrow Lake, gaming y productividad equilibrados LGA1851',
    socket: 'LGA1851', cores: 20, threads: 20, baseClock: 3.9, boostClock: 5.5,
    tdp: 125, generation: 'Arrow Lake', includesCooler: false,
  },
  {
    id: 'cpu-006', slot: 'cpu', brand: 'Intel', name: 'Core Ultra 5 245K',
    price: 309, image: '🔲', inStock: true, powerDraw: 125,
    description: '14 núcleos Arrow Lake, entry-level gaming LGA1851',
    socket: 'LGA1851', cores: 14, threads: 14, baseClock: 4.2, boostClock: 5.2,
    tdp: 125, generation: 'Arrow Lake', includesCooler: false,
  },
]

export const motherboards: MotherboardProduct[] = [
  {
    id: 'mb-001', slot: 'motherboard', brand: 'ASUS', name: 'ROG Crosshair X870E Hero',
    price: 549, image: '🟫', inStock: true, powerDraw: 30,
    description: 'Flagship AM5 X870E con WiFi 7, 5G LAN, PCIe 5.0',
    socket: 'AM5', formFactor: 'ATX', ramType: 'DDR5', ramSlots: 4,
    maxRAM: 256, pciegen: 'PCIe 5.0', m2Slots: 4,
  },
  {
    id: 'mb-002', slot: 'motherboard', brand: 'MSI', name: 'MAG X870 Tomahawk WiFi',
    price: 299, image: '🟫', inStock: true, powerDraw: 25,
    description: 'AM5 X870 mid-range con WiFi 6E y DDR5',
    socket: 'AM5', formFactor: 'ATX', ramType: 'DDR5', ramSlots: 4,
    maxRAM: 192, pciegen: 'PCIe 5.0', m2Slots: 3,
  },
  {
    id: 'mb-003', slot: 'motherboard', brand: 'Gigabyte', name: 'B850M DS3H WiFi',
    price: 159, image: '🟫', inStock: true, powerDraw: 20,
    description: 'AM5 B850 mATX económica con DDR5',
    socket: 'AM5', formFactor: 'mATX', ramType: 'DDR5', ramSlots: 2,
    maxRAM: 96, pciegen: 'PCIe 5.0', m2Slots: 2,
  },
  {
    id: 'mb-004', slot: 'motherboard', brand: 'ASUS', name: 'ROG Maximus Z890 Apex',
    price: 699, image: '🟫', inStock: true, powerDraw: 35,
    description: 'Flagship Intel Z890 LGA1851 para overclocking extremo',
    socket: 'LGA1851', formFactor: 'ATX', ramType: 'DDR5', ramSlots: 4,
    maxRAM: 256, pciegen: 'PCIe 5.0', m2Slots: 5,
  },
  {
    id: 'mb-005', slot: 'motherboard', brand: 'MSI', name: 'PRO Z890-A WiFi',
    price: 279, image: '🟫', inStock: true, powerDraw: 25,
    description: 'Intel Z890 LGA1851 balanceada con WiFi 7',
    socket: 'LGA1851', formFactor: 'ATX', ramType: 'DDR5', ramSlots: 4,
    maxRAM: 192, pciegen: 'PCIe 5.0', m2Slots: 3,
  },
  {
    id: 'mb-006', slot: 'motherboard', brand: 'ASRock', name: 'Z890M Pro-A WiFi',
    price: 219, image: '🟫', inStock: true, powerDraw: 22,
    description: 'Intel Z890 LGA1851 mATX compacta',
    socket: 'LGA1851', formFactor: 'mATX', ramType: 'DDR5', ramSlots: 4,
    maxRAM: 192, pciegen: 'PCIe 5.0', m2Slots: 2,
  },
]

export const rams: RAMProduct[] = [
  {
    id: 'ram-001', slot: 'ram', brand: 'G.Skill', name: 'Trident Z5 RGB 32GB DDR5-6400',
    price: 169990, image: '📊', inStock: true, powerDraw: 5,
    description: '2x16GB DDR5-6400 CL32, EXPO y XMP 3.0',
    type: 'DDR5', frequency: 6400, capacity: 32, modules: 2, latency: 'CL32',
  },
  {
    id: 'ram-002', slot: 'ram', brand: 'Corsair', name: 'Dominator Titanium 64GB DDR5-6000',
    price: 279990, image: '📊', inStock: true, powerDraw: 8,
    description: '2x32GB DDR5-6000 CL30, EXPO y XMP 3.0',
    type: 'DDR5', frequency: 6000, capacity: 64, modules: 2, latency: 'CL30',
  },
  {
    id: 'ram-003', slot: 'ram', brand: 'Kingston', name: 'Fury Beast 16GB DDR5-5600',
    price: 89990, image: '📊', inStock: true, powerDraw: 4,
    description: '2x8GB DDR5-5600 CL40, entry-level DDR5',
    type: 'DDR5', frequency: 5600, capacity: 16, modules: 2, latency: 'CL40',
  },
  {
    id: 'ram-004', slot: 'ram', brand: 'G.Skill', name: 'Trident Z5 RGB 32GB DDR5-7200',
    price: 209990, image: '📊', inStock: true, powerDraw: 6,
    description: '2x16GB DDR5-7200 CL34, para overclockers extremos',
    type: 'DDR5', frequency: 7200, capacity: 32, modules: 2, latency: 'CL34',
  },
  {
    id: 'ram-005', slot: 'ram', brand: 'TeamGroup', name: 'T-Force Delta RGB 32GB DDR4-3600',
    price: 99990, image: '📊', inStock: true, powerDraw: 5,
    description: '2x16GB DDR4-3600 CL18, DDR4 de alto rendimiento',
    type: 'DDR4', frequency: 3600, capacity: 32, modules: 2, latency: 'CL18',
  },
  {
    id: 'ram-006', slot: 'ram', brand: 'Corsair', name: 'Vengeance RGB 96GB DDR5-6400',
    price: 899990, image: '📊', inStock: true, powerDraw: 10,
    description: '2x48GB DDR5-6400 CL32 para workstation y creación',
    type: 'DDR5', frequency: 6400, capacity: 96, modules: 2, latency: 'CL32',
  },
  {
    id: 'ram-007', slot: 'ram', brand: 'Kingston', name: 'Fury Renegade 48GB DDR5-7200',
    price: 679990, image: '📊', inStock: true, powerDraw: 7,
    description: '2x24GB DDR5-7200 CL38 para gaming de alto rendimiento',
    type: 'DDR5', frequency: 7200, capacity: 48, modules: 2, latency: 'CL38',
  },
  {
    id: 'ram-008', slot: 'ram', brand: 'TeamGroup', name: 'T-Force Vulcan 32GB DDR5-6000',
    price: 149990, image: '📊', inStock: true, powerDraw: 5,
    description: '2x16GB DDR5-6000 CL30, opción equilibrada precio/rendimiento',
    type: 'DDR5', frequency: 6000, capacity: 32, modules: 2, latency: 'CL30',
  },
]

export const gpus: GPUProduct[] = [
  {
    id: 'gpu-001', slot: 'gpu', brand: 'NVIDIA', name: 'RTX 5090',
    price: 1999, image: '🎮', inStock: true, powerDraw: 575,
    description: 'La GPU más potente del mundo, Blackwell arquitectura',
    vram: 32, pciegen: 'PCIe 5.0', length: 340, series: 'RTX 5000',
  },
  {
    id: 'gpu-002', slot: 'gpu', brand: 'NVIDIA', name: 'RTX 5080',
    price: 999, image: '🎮', inStock: true, powerDraw: 360,
    description: 'Flagship tier 2, Blackwell, 16GB GDDR7',
    vram: 16, pciegen: 'PCIe 5.0', length: 310, series: 'RTX 5000',
  },
  {
    id: 'gpu-003', slot: 'gpu', brand: 'NVIDIA', name: 'RTX 5070 Ti',
    price: 749, image: '🎮', inStock: true, powerDraw: 300,
    description: '4K gaming sólido con 16GB GDDR7 Blackwell',
    vram: 16, pciegen: 'PCIe 5.0', length: 295, series: 'RTX 5000',
  },
  {
    id: 'gpu-004', slot: 'gpu', brand: 'NVIDIA', name: 'RTX 5070',
    price: 549, image: '🎮', inStock: true, powerDraw: 250,
    description: '1440p y 4K DLSS4, 12GB GDDR7',
    vram: 12, pciegen: 'PCIe 5.0', length: 270, series: 'RTX 5000',
  },
  {
    id: 'gpu-005', slot: 'gpu', brand: 'AMD', name: 'RX 9070 XT',
    price: 599, image: '🎮', inStock: true, powerDraw: 304,
    description: 'RDNA 4, rival directo del RTX 5070 Ti con 16GB',
    vram: 16, pciegen: 'PCIe 5.0', length: 285, series: 'RX 9000',
  },
  {
    id: 'gpu-006', slot: 'gpu', brand: 'AMD', name: 'RX 9070',
    price: 449, image: '🎮', inStock: true, powerDraw: 220,
    description: 'RDNA 4 mid-range con 16GB GDDR6',
    vram: 16, pciegen: 'PCIe 5.0', length: 255, series: 'RX 9000',
  },
]

export const psus: PSUProduct[] = [
  {
    id: 'psu-001', slot: 'psu', brand: 'Corsair', name: 'RM1000x SHIFT 1000W',
    price: 199, image: '⚡', inStock: true, powerDraw: 0,
    description: '1000W 80+ Gold, modular lateral, silencioso',
    wattage: 1000, efficiency: '80+ Gold', modular: 'full',
  },
  {
    id: 'psu-002', slot: 'psu', brand: 'Seasonic', name: 'Focus GX-850 850W',
    price: 149, image: '⚡', inStock: true, powerDraw: 0,
    description: '850W 80+ Gold Full Modular, Tier A confiable',
    wattage: 850, efficiency: '80+ Gold', modular: 'full',
  },
  {
    id: 'psu-003', slot: 'psu', brand: 'ASUS', name: 'ROG THOR 1200W Platinum',
    price: 299, image: '⚡', inStock: true, powerDraw: 0,
    description: '1200W 80+ Platinum con display OLED de watts',
    wattage: 1200, efficiency: '80+ Platinum', modular: 'full',
  },
  {
    id: 'psu-004', slot: 'psu', brand: 'be quiet!', name: 'Dark Power Pro 13 1600W',
    price: 399, image: '⚡', inStock: true, powerDraw: 0,
    description: '1600W 80+ Titanium para workstations extremas',
    wattage: 1600, efficiency: '80+ Titanium', modular: 'full',
  },
  {
    id: 'psu-005', slot: 'psu', brand: 'EVGA', name: 'SuperNOVA 750 G7 750W',
    price: 119, image: '⚡', inStock: true, powerDraw: 0,
    description: '750W 80+ Gold Full Modular, excelente para mid-range',
    wattage: 750, efficiency: '80+ Gold', modular: 'full',
  },
]

export const storages: StorageProduct[] = [
  {
    id: 'ssd-001', slot: 'storage', brand: 'Samsung', name: '990 Pro 2TB NVMe',
    price: 179, image: '💾', inStock: true, powerDraw: 6,
    description: 'NVMe PCIe 4.0 7450/6900 MB/s, el SSD más rápido mainstream',
    type: 'NVMe M.2', capacity: 2000, readSpeed: 7450, writeSpeed: 6900,
  },
  {
    id: 'ssd-002', slot: 'storage', brand: 'WD', name: 'Black SN850X 4TB NVMe',
    price: 349, image: '💾', inStock: true, powerDraw: 8,
    description: 'NVMe PCIe 4.0 7300 MB/s, capacidad para toda tu librería',
    type: 'NVMe M.2', capacity: 4000, readSpeed: 7300, writeSpeed: 7100,
  },
  {
    id: 'ssd-003', slot: 'storage', brand: 'Crucial', name: 'T705 2TB NVMe PCIe 5.0',
    price: 229, image: '💾', inStock: true, powerDraw: 9,
    description: 'PCIe 5.0 14500 MB/s, el más rápido del mercado',
    type: 'NVMe M.2', capacity: 2000, readSpeed: 14500, writeSpeed: 12700,
  },
  {
    id: 'ssd-004', slot: 'storage', brand: 'Seagate', name: 'IronWolf 8TB HDD',
    price: 199, image: '💾', inStock: true, powerDraw: 10,
    description: 'HDD 7200 RPM para almacenamiento masivo',
    type: 'HDD', capacity: 8000, readSpeed: 250, writeSpeed: 250,
  },
]

export const coolers: CoolerProduct[] = [
  {
    id: 'cool-001', slot: 'cooler', brand: 'Corsair', name: 'iCUE H170i Elite 420mm AIO',
    price: 259, image: '❄️', inStock: true, powerDraw: 15,
    description: 'AIO 420mm RGB premium, máximo enfriamiento líquido',
    type: 'aio', aioSize: 360, fanCount: 3, maxTDP: 350,
    compatibleSockets: ['AM5', 'LGA1700', 'LGA1851'],
  },
  {
    id: 'cool-002', slot: 'cooler', brand: 'NZXT', name: 'Kraken Elite 360 RGB',
    price: 229, image: '❄️', inStock: true, powerDraw: 12,
    description: 'AIO 360mm con pantalla LCD en la bomba',
    type: 'aio', aioSize: 360, fanCount: 3, maxTDP: 300,
    compatibleSockets: ['AM5', 'LGA1700', 'LGA1851'],
  },
  {
    id: 'cool-003', slot: 'cooler', brand: 'Arctic', name: 'Liquid Freezer III 240',
    price: 79, image: '❄️', inStock: true, powerDraw: 10,
    description: 'AIO 240mm, la mejor relación precio-rendimiento',
    type: 'aio', aioSize: 240, fanCount: 2, maxTDP: 250,
    compatibleSockets: ['AM5', 'LGA1700', 'LGA1851'],
  },
  {
    id: 'cool-004', slot: 'cooler', brand: 'Noctua', name: 'NH-D15 G2',
    price: 149, image: '❄️', inStock: true, powerDraw: 5,
    description: 'El mejor enfriador de aire del mercado, doble torre',
    type: 'air', fanCount: 2, maxTDP: 250,
    compatibleSockets: ['AM5', 'LGA1700', 'LGA1851'],
  },
  {
    id: 'cool-005', slot: 'cooler', brand: 'be quiet!', name: 'Dark Rock Pro 5',
    price: 99, image: '❄️', inStock: true, powerDraw: 4,
    description: 'Torre dual ultra silenciosa con TDP 270W',
    type: 'air', fanCount: 2, maxTDP: 270,
    compatibleSockets: ['AM5', 'LGA1700', 'LGA1851'],
  },
]

export const allProducts: Product[] = [
  ...cases, ...cpus, ...motherboards, ...rams, ...gpus, ...psus, ...storages, ...coolers,
]

export const slotLabels: Record<string, string> = {
  case: 'Gabinete',
  cpu: 'Procesador',
  motherboard: 'Placa Madre',
  ram: 'Memoria RAM',
  gpu: 'Tarjeta de Video',
  psu: 'Fuente de Poder',
  storage: 'Almacenamiento',
  cooler: 'Refrigeración',
}

export const slotOrder: Array<string> = [
  'case', 'cpu', 'motherboard', 'ram', 'gpu', 'psu', 'storage', 'cooler',
]
