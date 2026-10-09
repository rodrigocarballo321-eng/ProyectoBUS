export const CONFIG = {
  diasTotales: 10, // días
  primerDia: 1, // día
  diasPorAvance: 1, // día
  cajaInicialCentavos: 3000, // centavos
  metaCajaCentavos: 12000, // centavos
  limiteQuiebraCentavos: 0, // centavos
  tarifaInicialCentavos: 25, // centavos por pasajero
  incrementoTarifaCentavos: 5, // centavos por pasajero
  centavosPorDolar: 100, // centavos por dólar
  pasajerosBase: 160, // pasajeros por día
  pasajerosPorDolarTarifa: 200, // pasajeros por dólar de tarifa
  costoCombustibleCentavos: 1200, // centavos por día
  costoMotoristaCentavos: 800, // centavos por día
} as const

export type ResultadoDia = {
  pasajeros: number
  ingresosCentavos: number
  costosCentavos: number
  gananciaCentavos: number
}

export type ResultadoFinal =
  | '¡Ganaste!'
  | 'Quebraste'
  | 'Terminaste el día 10 con menos de $120.'

export type EstadoJuego = {
  diaActual: number
  cajaCentavos: number
  tarifaCentavos: number
  resultadoDiaAnterior: ResultadoDia | null
  resultadoFinal: ResultadoFinal | null
}

export function crearEstadoInicial(): EstadoJuego {
  return {
    diaActual: CONFIG.primerDia,
    cajaCentavos: CONFIG.cajaInicialCentavos,
    tarifaCentavos: CONFIG.tarifaInicialCentavos,
    resultadoDiaAnterior: null,
    resultadoFinal: null,
  }
}

export function subirTarifa(estado: EstadoJuego): boolean {
  if (estado.resultadoFinal !== null) {
    return false
  }

  estado.tarifaCentavos += CONFIG.incrementoTarifaCentavos
  return true
}

export function bajarTarifa(estado: EstadoJuego): boolean {
  if (estado.resultadoFinal !== null) {
    return false
  }

  estado.tarifaCentavos -= CONFIG.incrementoTarifaCentavos
  return true
}

export function cerrarDia(estado: EstadoJuego): boolean {
  if (estado.resultadoFinal !== null) {
    return false
  }

  const pasajeros =
    CONFIG.pasajerosBase -
    (CONFIG.pasajerosPorDolarTarifa * estado.tarifaCentavos) /
      CONFIG.centavosPorDolar
  const ingresosCentavos = pasajeros * estado.tarifaCentavos
  const costosCentavos =
    CONFIG.costoCombustibleCentavos + CONFIG.costoMotoristaCentavos
  const gananciaCentavos = ingresosCentavos - costosCentavos

  estado.cajaCentavos += gananciaCentavos
  estado.resultadoDiaAnterior = {
    pasajeros,
    ingresosCentavos,
    costosCentavos,
    gananciaCentavos,
  }

  if (estado.cajaCentavos < CONFIG.limiteQuiebraCentavos) {
    estado.resultadoFinal = 'Quebraste'
    return true
  }

  if (estado.diaActual === CONFIG.diasTotales) {
    estado.resultadoFinal =
      estado.cajaCentavos >= CONFIG.metaCajaCentavos
        ? '¡Ganaste!'
        : 'Terminaste el día 10 con menos de $120.'
    return true
  }

  estado.diaActual += CONFIG.diasPorAvance
  return true
}

export function reiniciarJuego(estado: EstadoJuego): boolean {
  Object.assign(estado, crearEstadoInicial())
  return true
}
