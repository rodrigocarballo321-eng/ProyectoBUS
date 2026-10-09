# Prompts y cambios solicitados: Ruta de bus

## Proyecto inicial
- Crear el proyecto con Vite y la plantilla vanilla TypeScript.
- Instalar Vitest, ESLint, TypeScript ESLint y `@eslint/js`. Se interpretó `eslinkt` como un error tipográfico de `eslint`.
- Eliminar los ejemplos de Vite y dejar `src/main.ts` vacío antes de implementar la aplicación.

## Lógica del juego
- Crear `src/logica.ts` para “Ruta de bus: ¿cuánto cobro?”, siguiendo la ficha: 10 días, $30 iniciales, tarifa inicial de $0.25, cambios de $0.05, meta de $120 y costos fijos diarios de $20.
- Mantener las reglas separadas de la interfaz y hacer que las acciones indiquen si pudieron realizarse.
- No agregar azar, eventos, rutas adicionales, sonido, guardado ni imágenes.
- Mantener la fórmula de pasajeros y los límites tal como aparecen en la ficha, sin inventar límites de tarifa.
- Agregar una bitácora en memoria con el resultado y el balance de cada cierre. Mostrarla durante la partida y al final; vaciarla al reiniciar.
- No cambiar las reglas ni la dificultad al añadir la bitácora.

## Pruebas
- Crear pruebas Vitest en `test/logica.test.ts` para el estado inicial, las acciones, los finales, el reinicio y una partida completa que demuestre que se puede ganar.
- Agregar una prueba para ganar terminando exactamente con $120.
- Configurar `npm test` para ejecutar Vitest.

## Interfaz y estilos
- Crear una interfaz con estados de inicio, partida y final, conectada a `logica.ts`.
- Usar la paleta solicitada: fondo `#F9FAFB`, azul `#1E3A8A`, verde `#10B981`, ámbar `#F59E0B`, gris de texto `#374151` y superficies blancas.
- Adaptar la interfaz a móviles: controles de al menos 44 × 44 px, sin desplazamiento horizontal, texto mínimo de 16 px y uso con toque y teclado.
- Mantener la etiqueta `viewport` y el color de la barra del navegador acorde al tema.

## Documentación y revisiones
- Crear `README.md` en español con el nombre y frase de la ficha, uso en tres líneas, enlace, comandos para ejecutar el proyecto y espacios comentados para completar autoría y experiencia de prueba.
- Documentar el caso de tarifa negativa como comportamiento a revisar, aclarando que la ficha no define una tarifa mínima.
- Revisar seis posibles problemas: lógica en la interfaz, números fuera de `CONFIG`, posibilidad de ganar, reinicio, código sin uso y reglas sin pruebas.
- Crear una prueba adicional para el límite exacto de victoria.
- Crear el punto de restauración Git `punto-restauracion-2026-10-09`.
- Explicar cómo funciona el juego antes y después de agregar la bitácora, y aclarar que combustible y motorista son costos fijos diarios en el modelo.

## Preferencias de colaboración
- Antes de modificar archivos, mostrar el cambio propuesto y esperar aprobación.
- No instalar librerías ni crear archivos sin consultar.
- Avisar antes de ampliar el alcance o cambiar algo no solicitado; decirlo si hay dudas sobre cómo resolverlo.
