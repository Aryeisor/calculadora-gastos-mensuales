// Logica principal de la aplicacion

const formularioMovimiento = document.querySelector("#formulario-movimiento");
const inputDescripcion = document.querySelector("#descripcion");
const inputValor = document.querySelector("#valor");
const selectTipo = document.querySelector("#tipo");
const selectCategoria = document.querySelector("#categoria");
const inputFecha = document.querySelector("#fecha");

let movimientos = [];

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

  const movimiento = {
    id: Date.now(),
    descripcion: descripcion,
    valor: valor,
    tipo: tipo,
    categoria: categoria,
    fecha: fecha
  };

  movimientos.push(movimiento);

  console.log("Movimiento registrado:", movimiento);
  console.log("Lista de movimientos:", movimientos);

  formularioMovimiento.reset();
});
