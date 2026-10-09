# Ruta de bus: ¿cuánto cobro?

## 1. Nombre y frase

**Ruta de bus: ¿cuánto cobro?**

Eres dueño de un bus y durante 10 días decides cuánto cobrar de pasaje: si cobras poco no cubres los costos, y si cobras mucho se te vacía el bus.

## 2. Qué hace y cómo se usa

Ajustás la tarifa con los botones «+ $0.05» y «− $0.05» o con las flechas del teclado.  
Cerrás cada día con el botón o con Enter y revisás pasajeros, ingresos, costos y ganancia.  
El objetivo es terminar el día 10 con al menos $120 en caja, sin quebrar antes.

## 3. Enlace para abrirlo

[http://localhost:5173/](http://localhost:5173/)

## 4. Cómo correrlo en otra máquina

Con Node.js y npm instalados, ejecutá estos comandos desde la carpeta del proyecto:

```bash
npm install
npm run dev
```

## 5. Qué dirigí yo y qué error encontré probando

<!-- Completá esta sección. -->

## 6. Declaración de autoría

<!-- Completá esta sección: herramienta usada, generación del código por un agente de IA bajo tu dirección y partes que puedes explicar. -->

## Caso analizado: tarifa negativa

Al empezar con una tarifa de $0.25 y bajarla siete veces, queda en −$0.10. Al cerrar el día, la fórmula calcula 180 pasajeros, −$18 de ingresos, $20 de costos y −$38 de ganancia; la caja pasa de $30 a −$8 y el juego muestra «Quebraste».

Las tres causas probables son:

1. `bajarTarifa` resta $0.05 sin comprobar una tarifa mínima.
2. `cerrarDia` usa directamente la tarifa negativa para calcular pasajeros e ingresos.
3. La quiebra se determina después de restar la ganancia de la caja, sin validar antes la tarifa.

La ficha no especifica una tarifa mínima, así que este caso queda documentado como comportamiento a revisar, no como una regla confirmada.
