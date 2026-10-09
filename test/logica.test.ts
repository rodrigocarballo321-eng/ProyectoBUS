import { describe, expect, it } from 'vitest'
import { CONFIG, bajarTarifa, cerrarDia, crearEstadoInicial, reiniciarJuego, subirTarifa } from '../src/logica.ts'

describe('Reglas de Ruta de bus', () => {
  it('arma el estado inicial con los valores de la ficha', () => {
    expect(crearEstadoInicial()).toEqual({
      diaActual: 1,
      cajaCentavos: 3000,
      tarifaCentavos: 25,
      resultadoDiaAnterior: null,
      historialDias: [],
      resultadoFinal: null,
    })
  })

  it('sube la tarifa cinco centavos y confirma la acción válida', () => {
    const estado = crearEstadoInicial()

    expect(subirTarifa(estado)).toBe(true)
    expect(estado.tarifaCentavos).toBe(30)
  })

  it('baja la tarifa cinco centavos y confirma la acción válida', () => {
    const estado = crearEstadoInicial()

    expect(bajarTarifa(estado)).toBe(true)
    expect(estado.tarifaCentavos).toBe(20)
  })

  it('cierra un día con los pasajeros, ingresos, costos y ganancia esperados', () => {
    const estado = crearEstadoInicial()
    for (let indice = 0; indice < 3; indice += 1) {
      subirTarifa(estado)
    }

    expect(cerrarDia(estado)).toBe(true)
    expect(estado.resultadoDiaAnterior).toEqual({
      pasajeros: 80,
      ingresosCentavos: 3200,
      costosCentavos: 2000,
      gananciaCentavos: 1200,
    })
    expect(estado.cajaCentavos).toBe(4200)
    expect(estado.diaActual).toBe(2)
    expect(estado.historialDias).toEqual([{
      dia: 1,
      tarifaCentavos: 40,
      cajaAntesCentavos: 3000,
      pasajeros: 80,
      ingresosCentavos: 3200,
      costosCentavos: 2000,
      gananciaCentavos: 1200,
      cajaDespuesCentavos: 4200,
    }])
  })

  it('declara la quiebra cuando la caja queda bajo cero', () => {
    const estado = crearEstadoInicial()
    while (estado.tarifaCentavos < 100) {
      subirTarifa(estado)
    }

    expect(cerrarDia(estado)).toBe(true)
    expect(estado.cajaCentavos).toBeLessThan(0)
    expect(estado.resultadoFinal).toBe('Quebraste')
    expect(estado.historialDias).toHaveLength(1)
    expect(estado.historialDias[0].dia).toBe(1)
  })

  it('termina mal al cerrar el décimo día con menos de la meta', () => {
    const estado = crearEstadoInicial()
    for (let dia = 0; dia < CONFIG.diasTotales; dia += 1) {
      expect(cerrarDia(estado)).toBe(true)
    }

    expect(estado.cajaCentavos).toBe(10500)
    expect(estado.resultadoFinal).toBe('Terminaste el día 10 con menos de $120.')
  })

  it('gana al terminar exactamente con la meta', () => {
    const estado = crearEstadoInicial()
    estado.diaActual = CONFIG.diasTotales
    estado.tarifaCentavos = 40
    estado.cajaCentavos = CONFIG.metaCajaCentavos - 1200

    expect(cerrarDia(estado)).toBe(true)
    expect(estado.cajaCentavos).toBe(CONFIG.metaCajaCentavos)
    expect(estado.resultadoFinal).toBe('¡Ganaste!')
  })

  it('recorre diez días y alcanza el final bueno con una caja de ciento cincuenta dólares', () => {
    const estado = crearEstadoInicial()

    for (let dia = 0; dia < CONFIG.diasTotales; dia += 1) {
      while (estado.tarifaCentavos < 40) {
        expect(subirTarifa(estado)).toBe(true)
      }
      expect(cerrarDia(estado)).toBe(true)
    }

    expect(estado.cajaCentavos).toBe(15000)
    expect(estado.resultadoFinal).toBe('¡Ganaste!')
    expect(estado.historialDias).toHaveLength(CONFIG.diasTotales)
    expect(estado.historialDias[CONFIG.diasTotales - 1].cajaDespuesCentavos).toBe(15000)
  })

  it('rechaza subir, bajar o cerrar después del final y permite reiniciar', () => {
    const estado = crearEstadoInicial()
    while (estado.tarifaCentavos < 100) {
      subirTarifa(estado)
    }
    cerrarDia(estado)
    const cajaFinal = estado.cajaCentavos
    const tarifaFinal = estado.tarifaCentavos

    expect(subirTarifa(estado)).toBe(false)
    expect(bajarTarifa(estado)).toBe(false)
    expect(cerrarDia(estado)).toBe(false)
    expect(estado.cajaCentavos).toBe(cajaFinal)
    expect(estado.tarifaCentavos).toBe(tarifaFinal)
    expect(reiniciarJuego(estado)).toBe(true)
    expect(estado).toEqual(crearEstadoInicial())
    expect(estado.historialDias).toEqual([])
  })
})
