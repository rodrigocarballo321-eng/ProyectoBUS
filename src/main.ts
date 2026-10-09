import './estilo.css'
import {
	CONFIG,
	bajarTarifa,
	cerrarDia,
	crearEstadoInicial,
	reiniciarJuego,
	subirTarifa,
} from './logica'
import type { EstadoJuego } from './logica'

const elementoApp = document.querySelector<HTMLDivElement>('#app')

if (elementoApp === null) {
	throw new Error('No se encontró el elemento principal de la aplicación.')
}

const app: HTMLDivElement = elementoApp

let estado: EstadoJuego = crearEstadoInicial()
let pantalla: 'inicio' | 'juego' = 'inicio'

const acciones = {
	subir: subirTarifa,
	bajar: bajarTarifa,
	cerrar: cerrarDia,
}

function mostrarDinero(centavos: number): string {
	const signo = centavos < 0 ? '-$' : '$'
	const valor = Math.abs(centavos) / CONFIG.centavosPorDolar
	return `${signo}${valor.toFixed(2)}`
}

function dibujarInicio(): string {
	return `
		<main class="escenario escenario--inicio">
			<div class="encabezado-seccion">
				<p class="ceja"><span class="punto punto--ambar"></span> SIMULADOR DE RUTA URBANA</p>
				<span class="sello">RUTA 01 <span>/</span> 10 DÍAS</span>
			</div>

			<div class="presentacion">
				<div class="presentacion__texto">
					<h1>Rutas de<br /><span>bus</span></h1>
					<p class="bajada">¿Cuánto cobro?</p>
					<p class="descripcion">Cada día eliges la tarifa. Equilibra pasajeros, ingresos y costos para terminar el recorrido con la caja en verde.</p>
					<button class="boton boton--claro" type="button" data-accion="iniciar">
						Iniciar recorrido <span aria-hidden="true">→</span>
					</button>
				</div>

				<section class="hoja-salida" aria-label="Estado inicial">
					<div class="hoja-salida__encabezado">
						<span>HOJA DE SALIDA</span>
						<span class="hoja-salida__marca">RB—01</span>
					</div>
					<dl class="datos-inicio">
						<div><dt>Día de salida</dt><dd>${estado.diaActual} <span>/ ${CONFIG.diasTotales}</span></dd></div>
						<div><dt>Dinero en caja</dt><dd>${mostrarDinero(estado.cajaCentavos)}</dd></div>
						<div class="dato-tarifa"><dt>Tarifa elegida</dt><dd>${mostrarDinero(estado.tarifaCentavos)} <span>por pasajero</span></dd></div>
						<div><dt>Meta al día 10</dt><dd>${mostrarDinero(CONFIG.metaCajaCentavos)}</dd></div>
					</dl>
					<p class="hoja-salida__nota">Una ruta. Diez cierres. Tu decisión mueve el balance.</p>
				</section>
			</div>

			<div class="pie-inicio">
				<span>DECIDE LA TARIFA</span>
				<span class="linea-punteada" aria-hidden="true"></span>
				<span>CIERRA EL DÍA</span>
				<span class="linea-punteada" aria-hidden="true"></span>
				<span>LLEGA A LA META</span>
			</div>
		</main>
	`
}

function dibujarResultadoDia(): string {
	const resultado = estado.resultadoDiaAnterior

	if (resultado === null) {
		return `
			<div class="sin-resultado" role="status">
				<span class="sin-resultado__marca" aria-hidden="true">—</span>
				<span>Aún no cerraste un día. El primer balance aparecerá aquí.</span>
			</div>
		`
	}

	const claseGanancia = resultado.gananciaCentavos >= 0 ? 'resultado--positivo' : 'resultado--negativo'

	return `
		<dl class="resultado-dia">
			<div><dt>Pasajeros</dt><dd>${resultado.pasajeros}</dd></div>
			<div><dt>Ingresos</dt><dd>${mostrarDinero(resultado.ingresosCentavos)}</dd></div>
			<div><dt>Costos</dt><dd>${mostrarDinero(resultado.costosCentavos)}</dd></div>
			<div class="${claseGanancia}"><dt>Ganancia</dt><dd>${mostrarDinero(resultado.gananciaCentavos)}</dd></div>
		</dl>
	`
}

function dibujarHistorial(): string {
	if (estado.historialDias.length === 0) {
		return ''
	}

	const registros = estado.historialDias.map((registro) => {
		const claseGanancia = registro.gananciaCentavos >= 0
			? 'historial-registro__ganancia--positiva'
			: 'historial-registro__ganancia--negativa'

		return `
			<li class="historial-registro">
				<div><span>DÍA</span><strong>${registro.dia}</strong></div>
				<div><span>Tarifa</span><strong>${mostrarDinero(registro.tarifaCentavos)}</strong></div>
				<div><span>Pasajeros</span><strong>${registro.pasajeros}</strong></div>
				<div><span>Ingresos</span><strong>${mostrarDinero(registro.ingresosCentavos)}</strong></div>
				<div><span>Costos</span><strong>${mostrarDinero(registro.costosCentavos)}</strong></div>
				<div class="${claseGanancia}"><span>Ganancia</span><strong>${mostrarDinero(registro.gananciaCentavos)}</strong></div>
				<div><span>Caja final</span><strong>${mostrarDinero(registro.cajaDespuesCentavos)}</strong></div>
			</li>
		`
	}).join('')

	return `
		<section class="historial" aria-labelledby="titulo-historial">
			<div class="titulo-fila">
				<div>
					<p class="ceja">REGISTRO DE CIERRES</p>
					<h2 id="titulo-historial">Bitácora de ruta</h2>
				</div>
				<span class="historial__cantidad">${estado.historialDias.length} días</span>
			</div>
			<ol class="historial-lista">${registros}</ol>
		</section>
	`
}

function dibujarPartida(): string {
	const segmentos = Array.from({ length: CONFIG.diasTotales }, (_, indice) => {
		const diaSegmento = indice + CONFIG.primerDia
		const clase = diaSegmento < estado.diaActual
			? 'segmento-dia--completo'
			: diaSegmento === estado.diaActual
				? 'segmento-dia--actual'
				: ''
		return `<span class="segmento-dia ${clase}" aria-hidden="true"></span>`
	}).join('')

	return `
		<main class="escenario escenario--partida">
			<div class="encabezado-seccion">
				<p class="ceja"><span class="punto punto--verde"></span> RUTA EN CURSO</p>
				<span class="sello">RUTA 01 <span>/</span> ${CONFIG.diasTotales} DÍAS</span>
			</div>

			<div class="tablero-dia">
				<div class="tablero-dia__numero"><span>DÍA</span><strong>${estado.diaActual}</strong><span>DE ${CONFIG.diasTotales}</span></div>
				<div class="segmentos-dia" aria-label="Día ${estado.diaActual} de ${CONFIG.diasTotales}">${segmentos}</div>
			</div>

			<section class="marcadores" aria-label="Estado de la ruta">
				<div class="marcador">
					<span class="marcador__etiqueta">DINERO EN CAJA</span>
					<strong class="marcador__valor">${mostrarDinero(estado.cajaCentavos)}</strong>
				</div>
				<div class="marcador marcador--meta">
					<span class="marcador__etiqueta">META AL DÍA ${CONFIG.diasTotales}</span>
					<strong class="marcador__valor">${mostrarDinero(CONFIG.metaCajaCentavos)}</strong>
				</div>
				<div class="marcador marcador--tarifa">
					<span class="marcador__etiqueta">TARIFA ELEGIDA</span>
					<strong class="marcador__valor">${mostrarDinero(estado.tarifaCentavos)}</strong>
					<span class="marcador__detalle">por pasajero</span>
				</div>
			</section>

			<section class="balance" aria-labelledby="titulo-balance">
				<div class="titulo-fila">
					<div>
						<p class="ceja">ÚLTIMO CIERRE</p>
						<h2 id="titulo-balance">Resultado del día anterior</h2>
					</div>
					${estado.resultadoDiaAnterior === null ? '' : `<span class="balance__dia">DÍA ${estado.diaActual - CONFIG.diasPorAvance}</span>`}
				</div>
				${dibujarResultadoDia()}
			</section>
			${dibujarHistorial()}

			<section class="controles" aria-label="Controles de la ruta">
				<div class="controles__tarifa">
					<span class="controles__etiqueta">AJUSTAR TARIFA</span>
					<div class="grupo-botones">
						<button class="boton boton--tarifa" type="button" data-accion="bajar" aria-label="Bajar la tarifa cinco centavos">− $0.05</button>
						<button class="boton boton--tarifa" type="button" data-accion="subir" aria-label="Subir la tarifa cinco centavos">+ $0.05</button>
					</div>
				</div>
				<button class="boton boton--cerrar" type="button" data-accion="cerrar">Cerrar el día <span aria-hidden="true">→</span></button>
			</section>

			<p class="ayuda-teclado">Teclado: ↑ / → subir · ↓ / ← bajar · Enter cerrar el día</p>
		</main>
	`
}

function dibujarFinal(): string {
	const gano = estado.resultadoFinal === '¡Ganaste!'
	const claseFinal = gano ? 'final--ganado' : 'final--perdido'

	return `
		<main class="escenario escenario--final ${claseFinal}">
			<div class="encabezado-seccion">
				<p class="ceja"><span class="punto ${gano ? 'punto--verde' : 'punto--rojo'}"></span> RECORRIDO FINALIZADO</p>
				<span class="sello">RUTA 01 <span>/</span> ${CONFIG.diasTotales} DÍAS</span>
			</div>

			<section class="cierre-final" aria-live="polite">
				<p class="cierre-final__rotulo">BALANCE DE RUTA</p>
				<h1>${estado.resultadoFinal}</h1>
				<p class="cierre-final__resumen">${gano ? 'La caja alcanzó la meta del recorrido.' : 'El balance final de la ruta quedó por debajo del objetivo.'}</p>
				<div class="cierre-final__caja">
					<span>DINERO EN CAJA</span>
					<strong>${mostrarDinero(estado.cajaCentavos)}</strong>
					<span>META ${mostrarDinero(CONFIG.metaCajaCentavos)}</span>
				</div>
			</section>

			<section class="balance balance--final" aria-labelledby="titulo-balance-final">
				<div class="titulo-fila">
					<div>
						<p class="ceja">ÚLTIMO CIERRE</p>
						<h2 id="titulo-balance-final">Resultado del día ${estado.diaActual}</h2>
					</div>
				</div>
				${dibujarResultadoDia()}
			</section>
			${dibujarHistorial()}

			<button class="boton boton--claro boton--reiniciar" type="button" data-accion="reiniciar">Volver a empezar <span aria-hidden="true">↻</span></button>
		</main>
	`
}

function dibujar(): void {
	let contenido: string

	if (estado.resultadoFinal !== null) {
		contenido = dibujarFinal()
	} else if (pantalla === 'inicio') {
		contenido = dibujarInicio()
	} else {
		contenido = dibujarPartida()
	}

	app.innerHTML = `
		<div class="app-shell">
			<header class="masthead">
				<div class="marca">
					<span class="marca__sello" aria-hidden="true">RB</span>
					<div class="marca__texto">RUTAS DE BUS<span>SIMULADOR DE TARIFA</span></div>
				</div>
				<div class="estado-servicio"><span class="punto punto--verde" aria-hidden="true"></span><span>PANEL DE RUTA</span></div>
			</header>
			${contenido}
		</div>
	`
}

app.addEventListener('click', (evento: MouseEvent) => {
	const objetivo = evento.target
	if (!(objetivo instanceof Element)) {
		return
	}

	const boton = objetivo.closest<HTMLButtonElement>('[data-accion]')
	const accion = boton?.dataset.accion

	if (accion === 'iniciar') {
		pantalla = 'juego'
		dibujar()
		return
	}

	if (accion === 'reiniciar') {
		if (reiniciarJuego(estado)) {
			pantalla = 'inicio'
			dibujar()
		}
		return
	}

	if (accion === 'subir' || accion === 'bajar' || accion === 'cerrar') {
		if (acciones[accion](estado)) {
			dibujar()
		}
	}
})

window.addEventListener('keydown', (evento: KeyboardEvent) => {
	if (pantalla !== 'juego' || estado.resultadoFinal !== null) {
		return
	}

	let accion: keyof typeof acciones | null = null

	if (evento.key === 'ArrowUp' || evento.key === 'ArrowRight') {
		accion = 'subir'
	} else if (evento.key === 'ArrowDown' || evento.key === 'ArrowLeft') {
		accion = 'bajar'
	} else if (evento.key === 'Enter' && !(evento.target instanceof HTMLButtonElement)) {
		accion = 'cerrar'
	}

	if (accion !== null) {
		evento.preventDefault()
		if (acciones[accion](estado)) {
			dibujar()
		}
	}
})

dibujar()

