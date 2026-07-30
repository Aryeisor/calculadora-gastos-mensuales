# Calculadora de Gastos Personales

Aplicacion web creada con HTML, CSS y JavaScript puro para registrar ingresos y gastos personales, calcular el saldo disponible y conservar la informacion en el navegador mediante localStorage.

Este proyecto fue desarrollado paso a paso con fines de aprendizaje, aplicando buenas practicas basicas de estructura, estilos, manipulacion del DOM y control de versiones con Git.

## Funcionalidades

- Registrar ingresos y gastos.
- Agregar descripcion, valor, tipo, categoria y fecha.
- Mostrar los movimientos registrados en una tabla.
- Calcular total de ingresos.
- Calcular total de gastos.
- Calcular saldo disponible.
- Mostrar valores en pesos colombianos.
- Editar movimientos existentes.
- Cancelar la edicion de un movimiento.
- Eliminar movimientos con modal de confirmacion personalizado.
- Buscar movimientos por descripcion.
- Filtrar movimientos por tipo.
- Filtrar movimientos por categoria.
- Limpiar filtros.
- Mostrar contador de movimientos.
- Guardar informacion en localStorage.
- Cargar datos guardados al recargar la pagina.
- Asignar la fecha actual por defecto.
- Mostrar validaciones visuales en el formulario.
- Mostrar mensajes de exito y error.
- Cambiar el color del saldo segun su estado.
- Diseno responsive para diferentes tamanos de pantalla.

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript puro
- localStorage
- Git y GitHub

## Estructura Del Proyecto

```text
CALCULADORA-INGRESOS-MENSUALES/
|-- index.html
|-- css/
|   `-- styles.css
|-- js/
|   `-- app.js
|-- assets/
|   `-- .gitkeep
|-- screenshots/
|   `-- .gitkeep
|-- README.md
`-- .gitignore
```

## Como Ejecutar El Proyecto

1. Descargar o clonar el repositorio.
2. Abrir la carpeta del proyecto.
3. Abrir el archivo `index.html` en el navegador.

No requiere instalacion de dependencias ni servidor local, porque esta construido con HTML, CSS y JavaScript puro.

## Como Usar La Aplicacion

1. Completa el formulario de registro con descripcion, valor, tipo, categoria y fecha.
2. Presiona `Guardar movimiento`.
3. Revisa el resumen financiero.
4. Usa la tabla para editar o eliminar movimientos.
5. Usa los filtros para buscar movimientos especificos.
6. Recarga la pagina para comprobar que los datos se conservan en localStorage.

## Conceptos Practicados

- Estructura semantica con HTML.
- Estilos responsive con CSS.
- Uso de formularios.
- Seleccion de elementos con `querySelector`.
- Manejo de eventos con `addEventListener`.
- Creacion y actualizacion de elementos del DOM.
- Uso de arrays y objetos.
- Metodos `forEach`, `filter`, `find` y `map`.
- Formato de moneda con `Intl.NumberFormat`.
- Persistencia con `localStorage`.
- Validacion visual de formularios.
- Flujo de trabajo con commits pequenos en Git.

## Estado Actual

La aplicacion ya cuenta con las funcionalidades principales de registro, visualizacion, edicion, eliminacion, filtros, calculos financieros y persistencia local.

## Mejoras Futuras

- Agregar capturas de pantalla al README.
- Permitir exportar movimientos a CSV.
- Agregar filtros por rango de fechas.
- Crear categorias personalizadas.
- Agregar modo oscuro.
- Mejorar accesibilidad del modal y mensajes.
- Separar la logica JavaScript en varios archivos cuando el proyecto crezca.
