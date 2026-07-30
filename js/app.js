// Logica principal de la aplicacion

const formularioMovimiento = document.querySelector("#formulario-movimiento");
const inputDescripcion = document.querySelector("#descripcion");
const inputValor = document.querySelector("#valor");
const selectTipo = document.querySelector("#tipo");
const selectCategoria = document.querySelector("#categoria");
const inputFecha = document.querySelector("#fecha");
const tablaMovimientos = document.querySelector("#tabla-movimientos");
const contadorMovimientos = document.querySelector("#contador-movimientos");
const mensajeFormulario = document.querySelector("#mensaje-formulario");
const totalIngresos = document.querySelector("#total-ingresos");
const totalGastos = document.querySelector("#total-gastos");
const saldoDisponible = document.querySelector("#saldo-disponible");
const botonGuardar = document.querySelector("#boton-guardar");
const inputBuscarDescripcion = document.querySelector("#buscar-descripcion");
const selectFiltroTipo = document.querySelector("#filtro-tipo");
const selectFiltroCategoria = document.querySelector("#filtro-categoria");
const botonLimpiarFiltros = document.querySelector("#boton-limpiar-filtros");
const modalEliminar = document.querySelector("#modal-eliminar");
const mensajeModalEliminar = document.querySelector("#mensaje-modal-eliminar");
const botonCancelarEliminacion = document.querySelector("#boton-cancelar-eliminacion");
const botonConfirmarEliminacion = document.querySelector("#boton-confirmar-eliminacion");
const botonCancelarEdicion = document.querySelector("#boton-cancelar-edicion");

let movimientos = [];
let idMovimientoEditando = null;
let idMovimientoPendienteEliminar = null;

cargarMovimientos();
mostrarMovimientos();
actualizarResumen();
asignarFechaActual();

formularioMovimiento.addEventListener("submit", function(evento) {
  evento.preventDefault();

  const descripcion = inputDescripcion.value.trim();
  const valor = Number(inputValor.value);
  const tipo = selectTipo.value;
  const categoria = selectCategoria.value;
  const fecha = inputFecha.value;

  limpiarErroresFormulario();

  if (descripcion === "" || valor <= 0 || tipo === "" || categoria === "" || fecha === "") {
    mostrarErrorFormulario("Por favor completa todos los campos correctamente.");
    marcarCamposInvalidos(descripcion, valor, tipo, categoria, fecha);
    return;
  }

  const estaEditando = idMovimientoEditando !== null;

  if (estaEditando === false) {
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
  guardarMovimientos();

  limpiarFormulario();
  mostrarMensajeFormulario(
    estaEditando ? "Movimiento actualizado correctamente." : "Movimiento guardado correctamente.",
    "exito"
  );
});

tablaMovimientos.addEventListener("click", function(evento) {
  if (evento.target.classList.contains("boton-eliminar")) {
    const idMovimiento = Number(evento.target.dataset.id);
    abrirModalEliminar(idMovimiento);
  }

  if (evento.target.classList.contains("boton-editar")) {
    const idMovimiento = Number(evento.target.dataset.id);
    cargarMovimientoParaEditar(idMovimiento);
  }
});

inputBuscarDescripcion.addEventListener("input", function() {
  mostrarMovimientos();
});

selectFiltroTipo.addEventListener("change", function() {
  mostrarMovimientos();
});

selectFiltroCategoria.addEventListener("change", function() {
  mostrarMovimientos();
});

botonLimpiarFiltros.addEventListener("click", function() {
  limpiarFiltros();
});

botonCancelarEliminacion.addEventListener("click", function() {
  cerrarModalEliminar();
});

botonConfirmarEliminacion.addEventListener("click", function() {
  eliminarMovimientoSeleccionado();
});

modalEliminar.addEventListener("click", function(evento) {
  if (evento.target === modalEliminar) {
    cerrarModalEliminar();
  }
});

botonCancelarEdicion.addEventListener("click", function() {
  limpiarFormulario();
});

function mostrarMovimientos() {
  tablaMovimientos.innerHTML = "";
  const movimientosFiltrados = obtenerMovimientosFiltrados();
  actualizarContadorMovimientos(movimientosFiltrados.length);

  if (movimientos.length === 0) {
    const filaVacia = document.createElement("tr");
    const celdaVacia = document.createElement("td");

    celdaVacia.textContent = "No hay movimientos registrados.";
    celdaVacia.colSpan = 6;

    filaVacia.appendChild(celdaVacia);
    tablaMovimientos.appendChild(filaVacia);

    return;
  }

  if (movimientosFiltrados.length === 0) {
    const filaSinResultados = document.createElement("tr");
    const celdaSinResultados = document.createElement("td");

    celdaSinResultados.textContent = "No se encontraron movimientos con esos filtros.";
    celdaSinResultados.colSpan = 6;

    filaSinResultados.appendChild(celdaSinResultados);
    tablaMovimientos.appendChild(filaSinResultados);

    return;
  }

  movimientosFiltrados.forEach(function(movimiento) {
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

function obtenerMovimientosFiltrados() {
  const textoBusqueda = inputBuscarDescripcion.value.trim().toLowerCase();
  const tipoSeleccionado = selectFiltroTipo.value;
  const categoriaSeleccionada = selectFiltroCategoria.value;

  return movimientos.filter(function(movimiento) {
    const descripcionMovimiento = movimiento.descripcion.toLowerCase();
    const coincideDescripcion = descripcionMovimiento.includes(textoBusqueda);
    const coincideTipo = tipoSeleccionado === "" || movimiento.tipo === tipoSeleccionado;
    const coincideCategoria = categoriaSeleccionada === "" || movimiento.categoria === categoriaSeleccionada;

    return coincideDescripcion && coincideTipo && coincideCategoria;
  });
}

function actualizarContadorMovimientos(cantidadVisible) {
  const totalMovimientos = movimientos.length;

  if (totalMovimientos === 0) {
    contadorMovimientos.textContent = "0 movimientos registrados";
    return;
  }

  if (cantidadVisible === totalMovimientos) {
    contadorMovimientos.textContent = totalMovimientos + " " + obtenerTextoMovimiento(totalMovimientos) + " registrados";
    return;
  }

  contadorMovimientos.textContent = "Mostrando " + cantidadVisible + " de " + totalMovimientos + " movimientos";
}

function obtenerTextoMovimiento(cantidad) {
  if (cantidad === 1) {
    return "movimiento";
  }

  return "movimientos";
}

function limpiarFiltros() {
  inputBuscarDescripcion.value = "";
  selectFiltroTipo.value = "";
  selectFiltroCategoria.value = "";

  mostrarMovimientos();
}

function mostrarErrorFormulario(mensaje) {
  mostrarMensajeFormulario(mensaje, "error");
}

function mostrarMensajeFormulario(mensaje, tipo) {
  mensajeFormulario.textContent = mensaje;
  mensajeFormulario.classList.remove("mensaje-error", "mensaje-exito");
  mensajeFormulario.classList.add("mensaje-" + tipo);
  mensajeFormulario.classList.remove("oculto");
}

function limpiarErroresFormulario() {
  mensajeFormulario.textContent = "";
  mensajeFormulario.classList.remove("mensaje-error", "mensaje-exito");
  mensajeFormulario.classList.add("oculto");

  inputDescripcion.classList.remove("campo-error");
  inputValor.classList.remove("campo-error");
  selectTipo.classList.remove("campo-error");
  selectCategoria.classList.remove("campo-error");
  inputFecha.classList.remove("campo-error");
}

function marcarCamposInvalidos(descripcion, valor, tipo, categoria, fecha) {
  if (descripcion === "") {
    inputDescripcion.classList.add("campo-error");
  }

  if (valor <= 0) {
    inputValor.classList.add("campo-error");
  }

  if (tipo === "") {
    selectTipo.classList.add("campo-error");
  }

  if (categoria === "") {
    selectCategoria.classList.add("campo-error");
  }

  if (fecha === "") {
    inputFecha.classList.add("campo-error");
  }
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
  actualizarColorSaldo(saldo);
}

function actualizarColorSaldo(saldo) {
  saldoDisponible.classList.remove("saldo-positivo", "saldo-neutral", "saldo-negativo");

  if (saldo > 0) {
    saldoDisponible.classList.add("saldo-positivo");
  } else if (saldo < 0) {
    saldoDisponible.classList.add("saldo-negativo");
  } else {
    saldoDisponible.classList.add("saldo-neutral");
  }
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
  botonCancelarEdicion.classList.remove("oculto");
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
  botonCancelarEdicion.classList.add("oculto");
  limpiarErroresFormulario();
  asignarFechaActual();
}

function asignarFechaActual() {
  const fechaActual = new Date();
  const anio = fechaActual.getFullYear();
  const mes = String(fechaActual.getMonth() + 1).padStart(2, "0");
  const dia = String(fechaActual.getDate()).padStart(2, "0");

  inputFecha.value = anio + "-" + mes + "-" + dia;
}

function abrirModalEliminar(id) {
  const movimientoEncontrado = movimientos.find(function(movimiento) {
    return movimiento.id === id;
  });

  if (movimientoEncontrado === undefined) {
    return;
  }

  idMovimientoPendienteEliminar = id;
  mensajeModalEliminar.textContent = "Estas seguro de eliminar el movimiento \"" + movimientoEncontrado.descripcion + "\"?";
  modalEliminar.classList.remove("oculto");
  modalEliminar.setAttribute("aria-hidden", "false");
}

function cerrarModalEliminar() {
  idMovimientoPendienteEliminar = null;
  modalEliminar.classList.add("oculto");
  modalEliminar.setAttribute("aria-hidden", "true");
}

function eliminarMovimientoSeleccionado() {
  const id = idMovimientoPendienteEliminar;

  if (id === null) {
    return;
  }

  movimientos = movimientos.filter(function(movimiento) {
    return movimiento.id !== id;
  });

  mostrarMovimientos();
  actualizarResumen();
  guardarMovimientos();

  if (idMovimientoEditando === id) {
    limpiarFormulario();
  }

  cerrarModalEliminar();
  mostrarMensajeFormulario("Movimiento eliminado correctamente.", "exito");
}

function guardarMovimientos() {
  localStorage.setItem("movimientos", JSON.stringify(movimientos));
}

function cargarMovimientos() {
  const movimientosGuardados = localStorage.getItem("movimientos");

  if (movimientosGuardados !== null) {
    movimientos = JSON.parse(movimientosGuardados);
  }
}

