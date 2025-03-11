// Categorías de medicamentos
export const categories = ["Antimicrobianos", "Oncológicos", "NPT", "Soluciones", "Insumos"]

// Almacenes simplificados
export const warehouses = ["Antimicrobianos", "Oncológicos", "NPT", "Soluciones", "Insumos"]

// Función para generar una fecha aleatoria entre 2025 y 2026
function randomExpiryDate() {
  const year = Math.random() > 0.5 ? 2025 : 2026
  const month = Math.floor(Math.random() * 12) + 1
  const day = Math.floor(Math.random() * 28) + 1
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
}

// Función para mapear los almacenes antiguos a los nuevos
function mapWarehouse(oldWarehouse) {
  if (oldWarehouse.includes("Antimicrobianos") || oldWarehouse.includes("ANT")) {
    return "Antimicrobianos"
  } else if (oldWarehouse.includes("Oncológicos") || oldWarehouse.includes("ONC")) {
    return "Oncológicos"
  } else if (oldWarehouse.includes("NPT")) {
    return "NPT"
  } else if (oldWarehouse.includes("Soluciones")) {
    return "Soluciones"
  } else {
    return "Insumos"
  }
}

// Datos de inventario actualizados con la información proporcionada
const originalInventoryData = [
  // Almacén Antimicrobianos
  {
    id: 1,
    name: "aciclovir 250 mg",
    lot: "T24F126-V",
    quantity: 150,
    expiryDate: "2026-02-28",
    status: "Normal",
    warehouse: "Almacén Antimicrobianos",
    code: "010.000.4264.00",
    origin: "Administración",
  },
  {
    id: 2,
    name: "cefepime 1000 mg",
    lot: "J24S063-V",
    quantity: 80,
    expiryDate: "2026-09-30",
    status: "Normal",
    warehouse: "Almacén Antimicrobianos",
    code: "010.000.5295.01",
    origin: "Administración",
  },
  {
    id: 3,
    name: "ceftazidima 1000 mg",
    lot: "R2303104-A",
    quantity: 30,
    expiryDate: "2025-03-31",
    status: "Bajo Stock",
    warehouse: "Almacén Antimicrobianos",
    code: "010.000.4254.00",
    origin: "Administración",
  },
  {
    id: 4,
    name: "meropenem 1000 mg",
    lot: "J24T019-V",
    quantity: 100,
    expiryDate: "2026-10-31",
    status: "Normal",
    warehouse: "Almacén Antimicrobianos",
    code: "010.000.5292.00",
    origin: "Administración",
  },
  {
    id: 5,
    name: "Voriconazoll 200 mg",
    lot: "3H730-V",
    quantity: 25,
    expiryDate: "2025-09-30",
    status: "Bajo Stock",
    warehouse: "Almacén Antimicrobianos",
    code: "010.000.5315.00",
    origin: "Administración",
  },
  {
    id: 6,
    name: "Voriconazoll 200 mg",
    lot: "3H730-A",
    quantity: 40,
    expiryDate: "2025-09-30",
    status: "Normal",
    warehouse: "Almacén Antimicrobianos",
    code: "010.000.5315.00",
    origin: "Administración",
  },

  // Almacén NPT
  {
    id: 7,
    name: "CLORURO DE POTASIO (2MEQ/ML)",
    lot: "R24S17-V",
    quantity: 15,
    expiryDate: "2026-09-30",
    status: "Bajo Stock",
    warehouse: "Almacén NPT",
    code: "010.000.0524.00",
    origin: "Administración",
  },
  {
    id: 8,
    name: "Sulfato de Magnesio (0.81 meq/ml)",
    lot: "R24E03-A",
    quantity: 20,
    expiryDate: "2026-01-31",
    status: "Normal",
    warehouse: "Almacén NPT",
    code: "010.000.3629.00",
    origin: "Administración",
  },

  // Almacén Oncológicos
  {
    id: 9,
    name: "ácido zoledrónico 4 mg",
    lot: "C24E002-F",
    quantity: 50,
    expiryDate: "2026-01-31",
    status: "Normal",
    warehouse: "Almacén Oncológicos",
    code: "010.000.5468.00",
    origin: "Administración",
  },
  {
    id: 10,
    name: "DACARBAZINA 200 mg",
    lot: "E670308-F",
    quantity: 35,
    expiryDate: "2025-07-09",
    status: "Normal",
    warehouse: "Almacén Oncológicos",
    code: "010.000.3003.00",
    origin: "Administración",
  },
  {
    id: 11,
    name: "DOCETAXEL 80 mg",
    lot: "23K032-F",
    quantity: 10,
    expiryDate: "2025-11-30",
    status: "Bajo Stock",
    warehouse: "Almacén Oncológicos",
    code: "010.000.5437.00",
    origin: "Administración",
  },
  {
    id: 12,
    name: "IFOSFAMIDA 1000 mg",
    lot: "05055-F",
    quantity: 200,
    expiryDate: "2025-06-30",
    status: "Normal",
    warehouse: "Almacén Oncológicos",
    code: "010.000.4432.00",
    origin: "Administración",
  },
  {
    id: 13,
    name: "METOTREXATO 500 mg",
    lot: "HIMH23011-F",
    quantity: 150,
    expiryDate: "2026-04-30",
    status: "Normal",
    warehouse: "Almacén Oncológicos",
    code: "010.000.1776.00",
    origin: "Administración",
  },
  {
    id: 14,
    name: "NIVOLUMAB 100 mg",
    lot: "ACS7118-F",
    quantity: 20,
    expiryDate: "2027-02-28",
    status: "Bajo Stock",
    warehouse: "Almacén Oncológicos",
    code: "010.000.6109.00",
    origin: "Administración",
  },
  {
    id: 15,
    name: "PACLITAXEL 300 mg",
    lot: "O240145A-F",
    quantity: 45,
    expiryDate: "2026-05-07",
    status: "Normal",
    warehouse: "Almacén Oncológicos",
    code: "010.000.5435.00",
    origin: "Administración",
  },
  {
    id: 16,
    name: "PANITUMUMAB 100 mg",
    lot: "1159344-F",
    quantity: 500,
    expiryDate: "2025-12-31",
    status: "Normal",
    warehouse: "Almacén Oncológicos",
    code: "010.000.5653.00",
    origin: "Administración",
  },

  // Área Aséptica Antimicrobianos
  {
    id: 17,
    name: "aciclovir 250 mg",
    lot: "T24F125-V",
    quantity: 300,
    expiryDate: "2026-02-28",
    status: "Normal",
    warehouse: "Área Aséptica Antimicrobianos",
    code: "010.000.4264.00",
    origin: "Administración",
  },
  {
    id: 18,
    name: "amfotericina b 50 mg",
    lot: "AB01123-A",
    quantity: 150,
    expiryDate: "2025-10-15",
    status: "Bajo Stock",
    warehouse: "Área Aséptica Antimicrobianos",
    code: "010.000.2012.00",
    origin: "Administración",
  },
  {
    id: 19,
    name: "amfotericina b liposomal 50 mg",
    lot: "043720-F",
    quantity: 200,
    expiryDate: "2026-02-28",
    status: "Normal",
    warehouse: "Área Aséptica Antimicrobianos",
    code: "010.000.6122.00",
    origin: "Administración",
  },
  {
    id: 20,
    name: "amikacina 500 mg",
    lot: "R24Y49-V",
    quantity: 180,
    expiryDate: "2026-05-31",
    status: "Normal",
    warehouse: "Área Aséptica Antimicrobianos",
    code: "010.000.1956.00",
    origin: "Administración",
  },

  // Área Aséptica NPT
  {
    id: 21,
    name: "AGUA INYECTABLE, 500 ml",
    lot: "H24S215-V",
    quantity: 120,
    expiryDate: "2026-09-30",
    status: "Normal",
    warehouse: "Área Aséptica NPT",
    code: "010.000.3675.00",
    origin: "Administración",
  },
  {
    id: 22,
    name: "Alanina y Levo-glutamina",
    lot: "16TI1812-V",
    quantity: 75,
    expiryDate: "2026-08-31",
    status: "Normal",
    warehouse: "Área Aséptica NPT",
    code: "010.000.2742.01",
    origin: "Administración",
  },
  {
    id: 23,
    name: "Aminoácidos cristalinos al 8% enriquecidos con CR al 42%",
    lot: "16TB0018-V",
    quantity: 60,
    expiryDate: "2026-01-31",
    status: "Bajo Stock",
    warehouse: "Área Aséptica NPT",
    code: "010.000.5393.00",
    origin: "Administración",
  },

  // Área Aséptica Oncológicos
  {
    id: 24,
    name: "ABATACEPT 250 mg",
    lot: "ACN2253-F",
    quantity: 90,
    expiryDate: "2027-05-31",
    status: "Normal",
    warehouse: "Área Aséptica Oncológicos",
    code: "010.000.5790.00",
    origin: "Administración",
  },
  {
    id: 25,
    name: "ácido folínico 3 mg",
    lot: "B23D735-F",
    quantity: 110,
    expiryDate: "2025-12-31",
    status: "Normal",
    warehouse: "Área Aséptica Oncológicos",
    code: "010.000.1707.00",
    origin: "Administración",
  },
  {
    id: 26,
    name: "ácido folínico, 50 mg",
    lot: "23XY001-F",
    quantity: 85,
    expiryDate: "2025-12-31",
    status: "Normal",
    warehouse: "Área Aséptica Oncológicos",
    code: "010.000.2192.00",
    origin: "Administración",
  },
  {
    id: 27,
    name: "ácido zoledrónico 4 mg",
    lot: "C24E028-F",
    quantity: 40,
    expiryDate: "2026-10-31",
    status: "Bajo Stock",
    warehouse: "Área Aséptica Oncológicos",
    code: "010.000.5468.00",
    origin: "Administración",
  },
  {
    id: 28,
    name: "ATEZOLIZUMAB 1200 mg",
    lot: "B0047B01-F",
    quantity: 25,
    expiryDate: "2027-01-26",
    status: "Bajo Stock",
    warehouse: "Área Aséptica Oncológicos",
    code: "010.000.6193.00",
    origin: "Administración",
  },

  // Materiales Generales
  {
    id: 29,
    name: "Jeringa de plástico con aguja estériles y desechables. Capacidad 5 ml",
    lot: "230756600",
    quantity: 500,
    expiryDate: "2028-07-31",
    status: "Normal",
    warehouse: "Materiales Generales",
    code: "060.550.2608",
    origin: "Administración",
  },
  {
    id: 30,
    name: "Jeringas de plástico para insulina. Capacidad 1 ml",
    lot: "125798",
    quantity: 350,
    expiryDate: "2026-08-31",
    status: "Normal",
    warehouse: "Materiales Generales",
    code: "060.550.2186",
    origin: "Administración",
  },

  // Materiales Indirectos
  {
    id: 31,
    name: "Cloruro de Sodio 0.9%. Envase con 250 ml",
    lot: "P24S302",
    quantity: 400,
    expiryDate: "2026-09-30",
    status: "Normal",
    warehouse: "Materiales Indirectos",
    code: "010.000.3608.00",
    origin: "Administración",
  },

  // Subalmacén Virtual generales ANT
  {
    id: 32,
    name: "Jeringa de plástico sin aguja estériles y desechables. Capacidad 20 ml",
    lot: "230946",
    quantity: 250,
    expiryDate: "2028-09-30",
    status: "Normal",
    warehouse: "Subalmacén Virtual generales ANT",
    code: "060.550.0453",
    origin: "Administración",
  },

  // Subalmacén Virtual generales NPT
  {
    id: 33,
    name: "Bolsa Para Alimentacio Parenteral Adulto 3 Lt",
    lot: "10C3-A",
    quantity: 180,
    expiryDate: "2028-03-31",
    status: "Normal",
    warehouse: "Subalmacén Virtual generales NPT",
    code: "060.125.3545",
    origin: "Administración",
  },
  {
    id: 34,
    name: "Bolsas. Para alimentación parenteral pediátrica de 500 ml",
    lot: "18L2-A",
    quantity: 120,
    expiryDate: "2027-12-31",
    status: "Normal",
    warehouse: "Subalmacén Virtual generales NPT",
    code: "060.125.0038",
    origin: "Administración",
  },

  // Subalmacén Virtual generales ONC
  {
    id: 35,
    name: "Jeringa de plástico con aguja estériles y desechables. Capacidad 10 ml",
    lot: "221039",
    quantity: 300,
    expiryDate: "2027-10-31",
    status: "Normal",
    warehouse: "Subalmacén Virtual generales ONC",
    code: "060.550.0016",
    origin: "Administración",
  },
  {
    id: 36,
    name: "Jeringa de plástico con aguja estériles y desechables. Capacidad 3 ml",
    lot: "230531",
    quantity: 280,
    expiryDate: "2028-05-31",
    status: "Normal",
    warehouse: "Subalmacén Virtual generales ONC",
    code: "060.550.1279",
    origin: "Administración",
  },

  // Subalmacén Virtual indirectos ANT
  {
    id: 37,
    name: "Cloruro de Sodio 0.9%. Envase con 100 ml",
    lot: "V24J277",
    quantity: 220,
    expiryDate: "2026-06-30",
    status: "Normal",
    warehouse: "Subalmacén Virtual indirectos ANT",
    code: "010.000.3627.00",
    origin: "Administración",
  },
  {
    id: 38,
    name: "Cloruro de Sodio 0.9%. Envase con 250 ml",
    lot: "P24T303",
    quantity: 190,
    expiryDate: "2026-10-31",
    status: "Normal",
    warehouse: "Subalmacén Virtual indirectos ANT",
    code: "010.000.3608.00",
    origin: "Administración",
  },

  // Subalmacén Virtual indirectos ONC
  {
    id: 39,
    name: "Cloruro de Sodio 0.9%. Envase con 100 ml",
    lot: "V24J277",
    quantity: 160,
    expiryDate: "2026-06-30",
    status: "Normal",
    warehouse: "Subalmacén Virtual indirectos ONC",
    code: "010.000.3627.00",
    origin: "Administración",
  },
  {
    id: 40,
    name: "Cloruro de Sodio 0.9%. Envase con 1000 ml",
    lot: "P24A065",
    quantity: 140,
    expiryDate: "2026-04-30",
    status: "Bajo Stock",
    warehouse: "Subalmacén Virtual indirectos ONC",
    code: "010.000.3610.00",
    origin: "Administración",
  },
]

// Mapear los datos de inventario a los nuevos almacenes
export const inventoryData = originalInventoryData.map((item) => ({
  ...item,
  warehouse: mapWarehouse(item.warehouse),
}))

// Datos de actividad reciente
export const recentActivityData = [
  {
    id: 1,
    user: {
      name: "Dr. García",
      avatar: "G",
    },
    action: "retiró",
    medication: "Paracetamol 500mg",
    quantity: "10 frascos",
    warehouse: "Antimicrobianos",
    timestamp: "Hoy, 10:30",
  },
  {
    id: 2,
    user: {
      name: "Dra. Martínez",
      avatar: "M",
    },
    action: "agregó",
    medication: "Amoxicilina 250mg",
    quantity: "50 frascos",
    warehouse: "Antimicrobianos",
    timestamp: "Ayer, 15:45",
  },
  {
    id: 3,
    user: {
      name: "Enfermero López",
      avatar: "L",
    },
    action: "actualizó",
    medication: "Solución Salina 0.9%",
    quantity: "25 frascos",
    warehouse: "Soluciones",
    timestamp: "Hace 2 días",
  },
  {
    id: 4,
    user: {
      name: "Dr. García",
      avatar: "G",
    },
    action: "retiró",
    medication: "Doxorrubicina 50mg",
    quantity: "5 frascos",
    warehouse: "Oncológicos",
    timestamp: "Hace 3 días",
  },
]

// Datos de consumo mensual de medicamentos (ejemplo)
export const monthlyConsumptionData = [
  {
    name: "Enero",
    Antimicrobianos: 2400,
    Oncológicos: 1398,
    NPT: 980,
    Soluciones: 3908,
    Insumos: 1500,
  },
  {
    name: "Febrero",
    Antimicrobianos: 2210,
    Oncológicos: 1000,
    NPT: 1100,
    Soluciones: 4800,
    Insumos: 1650,
  },
  {
    name: "Marzo",
    Antimicrobianos: 2290,
    Oncológicos: 950,
    NPT: 1200,
    Soluciones: 3800,
    Insumos: 1800,
  },
  {
    name: "Abril",
    Antimicrobianos: 2000,
    Oncológicos: 800,
    NPT: 1000,
    Soluciones: 4300,
    Insumos: 1700,
  },
  {
    name: "Mayo",
    Antimicrobianos: 2181,
    Oncológicos: 1100,
    NPT: 900,
    Soluciones: 3900,
    Insumos: 1850,
  },
  {
    name: "Junio",
    Antimicrobianos: 2500,
    Oncológicos: 1200,
    NPT: 1350,
    Soluciones: 4000,
    Insumos: 2000,
  },
]

// Datos de distribución por categorías (ejemplo)
export const categoryData = [
  { name: "Antimicrobianos", value: 25 },
  { name: "Oncológicos", value: 20 },
  { name: "NPT", value: 15 },
  { name: "Soluciones", value: 30 },
  { name: "Insumos", value: 10 },
]

