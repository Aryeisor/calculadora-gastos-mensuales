// Logica principal de la aplicacion

const formularioMovimiento = document.querySelector("#formulario-movimiento");
const inputDescripcion = document.querySelector("#descripcion");
const inputValor = document.querySelector("#valor");
const selectTipo = document.querySelector("#tipo");
const selectCategoria = document.querySelector("#categoria");
const inputFecha = document.querySelector("#fecha");
const tablaMovimientos = document.querySelector("#tabla-movimientos");
const totalIngresos = document.querySelector("#total-ingresos");
const totalGastos = document.querySelector("#total-gastos");
const saldoDisponible = document.querySelector("#saldo-disponible");
const botonGuardar = document.querySelector("#boton-guardar");

let movimientos = [];
let idMovimientoEditando = null;

formularioMovimiento.addEventListener("submit", function(evento) {
  evento.preventDefault();

  const descripcion = inputDescripcion.value.trim();
  const valor = Number(inputValor.value);
  const tipo = selectTipo.value;
  const categoria = selectCategoria.value;
  const fecha = inputFecha.value;

  if (descripcion === "" || valor <= 0 || tipo === "" || categoria === "" || fecha === "") {
    alert("Por favor completa todos los campos correctamente.");
    return;
  }

  if (idMovimientoEditando === null) {
    const movimiento = {
      id: Date.now(),
      descripcion: descripcion,
      valor: valor,
      tipo: tipo,
      categoria: categoria,
      fecha: fecha
    };

    movimientos.push(movimiento);
  } else {
    actualizarMovimiento(descripcion, valor, tipo, categoria, fecha);
  }

  mostrarMovimientos();
  actualizarResumen();

  limpiarFormulario();
});

tablaMovimientos.addEventListener("click", function(evento) {
  if (evento.target.classList.contains("boton-eliminar")) {
    const idMovimiento = Number(evento.target.dataset.id);
    eliminarMovimientoSeleccionado(idMovimiento);
  }

  if (evento.target.classList.contains("boton-editar")) {
    const idMovimiento = Number(evento.target.dataset.id);
    cargarMovimientoParaEditar(idMovimiento);
  }
});

function mostrarMovimientos() {
  tablaMovimientos.innerHTML = "";

  if (movimientos.length === 0) {
    const filaVacia = document.createElement("tr");
    const celdaVacia = document.createElement("td");

    celdaVacia.textContent = "No hay movimientos registrados.";
    celdaVacia.colSpan = 6;

    filaVacia.appendChild(celdaVacia);
    tablaMovimientos.appendChild(filaVacia);

    return;
  }

  movimientos.forEach(function(movimiento) {
    const fila = document.createElement("tr");

    fila.appendChild(crearCelda(movimiento.descripcion));
    fila.appendChild(crearCelda(formatearMoneda(movimiento.valor)));
    fila.appendChild(crearCeldaConEtiqueta(movimiento.tipo));
    fila.appendChild(crearCelda(formatearTexto(movimiento.categoria)));
    fila.appendChild(crearCelda(formatearFecha(movimiento.fecha)));
    fila.appendChild(crearCeldaAcciones(movimiento.id));

    tablaMovimientos.appendChild(fila);
  });
}

function crearCelda(texto) {
  const celda = document.createElement("td");
  celda.textContent = texto;
  return celda;
}

function crearCeldaConEtiqueta(tipo) {
  const celda = document.createElement("td");
  const etiqueta = document.createElement("span");

  etiqueta.textContent = formatearTexto(tipo);
  etiqueta.classList.add("etiqueta", "etiqueta-" + tipo);

  celda.appendChild(etiqueta);

  return celda;
}

function crearCeldaAcciones(id) {
  const celda = document.createElement("td");
  const contenedorBotones = document.createElement("div");
  const botonEditar = document.createElement("button");
  const botonEliminar = document.createElement("button");

  contenedorBotones.classList.add("botones-acciones");

  botonEditar.textContent = "Editar";
  botonEditar.type = "button";
  botonEditar.classList.add("boton-accion", "boton-editar");
  botonEditar.dataset.id = id;

  botonEliminar.textContent = "Eliminar";
  botonEliminar.type = "button";
  botonEliminar.classList.add("boton-accion", "boton-eliminar");
  botonEliminar.dataset.id = id;

  contenedorBotones.appendChild(botonEditar);
  contenedorBotones.appendChild(botonEliminar);
  celda.appendChild(contenedorBotones);

  return celda;
}

function formatearMoneda(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(valor);
}

function formatearFecha(fecha) {
  const fechaMovimiento = new Date(fecha + "T00:00:00");

  return fechaMovimiento.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function formatearTexto(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function actualizarResumen() {
  let ingresos = 0;
  let gastos = 0;

  movimientos.forEach(function(movimiento) {
    if (movimiento.tipo === "ingreso") {
      ingresos = ingresos + movimiento.valor;
    } else if (movimiento.tipo === "gasto") {
      gastos = gastos + movimiento.valor;
    }
  });

  const saldo = ingresos - gastos;

  totalIngresos.textContent = formatearMoneda(ingresos);
  totalGastos.textContent = formatearMoneda(gastos);
  saldoDisponible.textContent = formatearMoneda(saldo);
}

function cargarMovimientoParaEditar(id) {
  const movimientoEncontrado = movimientos.find(function(movimiento) {
    return movimiento.id === id;
  });

  if (movimientoEncontrado === undefined) {
    return;
  }

  inputDescripcion.value = movimientoEncontrado.descripcion;
  inputValor.value = movimientoEncontrado.valor;
  selectTipo.value = movimientoEncontrado.tipo;
  selectCategoria.value = movimientoEncontrado.categoria;
  inputFecha.value = movimientoEncontrado.fecha;

  idMovimientoEditando = id;
  botonGuardar.textContent = "Actualizar movimiento";
}

function actualizarMovimiento(descripcion, valor, tipo, categoria, fecha) {
  movimientos = movimientos.map(function(movimiento) {
    if (movimiento.id === idMovimientoEditando) {
      return {
        id: movimiento.id,
        descripcion: descripcion,
        valor: valor,
        tipo: tipo,
        categoria: categoria,
        fecha: fecha
      };
    }

    return movimiento;
  });
}

function limpiarFormulario() {
  formularioMovimiento.reset();
  idMovimientoEditando = null;
  botonGuardar.textContent = "Guardar movimiento";
}

function eliminarMovimientoSeleccionado(id) {
  const confirmarEliminacion = confirm("Deseas eliminar este movimiento?");

  if (confirmarEliminacion === false) {
    return;
  }

  movimientos = movimientos.filter(function(movimiento) {
    return movimiento.id !== id;
  });

  mostrarMovimientos();
  actualizarResumen();

  if (idMovimientoEditando === id) {
    limpiarFormulario();
  }
}

