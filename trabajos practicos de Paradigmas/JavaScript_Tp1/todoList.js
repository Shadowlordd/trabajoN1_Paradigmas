const { input, close } = require("./lib/nodeImperativo");

// Lista principal de tareas en memoria
let tareas = [];


// Muestra el menú principal y gestiona flujo
// ========================================
async function mostrarMenu() {
  console.log("\n📌 Menú Principal");
  console.log("[1] Ver Mis Tareas");
  console.log("[2] Buscar una Tarea");
  console.log("[3] Agregar una Tarea");
  console.log("[0] Salir");

  const opcion = await input("> ");

  switch (opcion) {
    case "1":
      await visualizarTareas();
      break;
    case "2":
      await buscarTareas();
      break;
    case "3":
      await agregarTarea();
      break;
    case "0":
      console.log("👋 Saliendo del sistema...");
      return;
    default:
      console.log("❌ Opción inválida.");
  }

  await main();
}

// ==========================================
// Ver tareas por estado y editar desde la lista
// ==========================================
async function visualizarTareas() {
  if (tareas.length === 0) {
    console.log("📭 No hay tareas para mostrar.");
    return;
  }

  console.log("\n📋 ¿Qué tareas deseas ver?");
  console.log("[1] Todas");
  console.log("[2] Pendientes");
  console.log("[3] En curso");
  console.log("[4] Terminadas");
  console.log("[0] Volver");

  const opcion = await input("> ");

  let filtradas = [];
  let etiqueta = "";

  switch (opcion) {
    case "1":
      filtradas = tareas;
      etiqueta = "todas";
      break;
    case "2":
      filtradas = tareas.filter(t => t.estado === "pendiente");
      etiqueta = "pendientes";
      break;
    case "3":
      filtradas = tareas.filter(t => t.estado === "en curso");
      etiqueta = "en curso";
      break;
    case "4":
      filtradas = tareas.filter(t => t.estado === "terminada");
      etiqueta = "terminadas";
      break;
    case "0":
      return;
    default:
      console.log("❌ Opción inválida.");
      return;
  }

  mostrarResultadosBusquedaEstado(filtradas, etiqueta);

  const editar = await input("\n¿Deseás editar alguna tarea? Ingresá el número o 0 para cancelar: ");
  const index = parseInt(editar) - 1;

  if (editar.trim() === "0") return;
  if (isNaN(index) || index < 0 || index >= filtradas.length) {
    console.log("❌ Número inválido.");
    return;
  }

  const tareaSeleccionada = filtradas[index];
  const posicionReal = tareas.indexOf(tareaSeleccionada);
  await editarTarea(posicionReal);
}

// ==========================================
// Edita una tarea por índice
// ==========================================
async function editarTarea(index) {
  const tarea = tareas[index];
  console.log(`\n✏️ Editando tarea: "${tarea.titulo}"`);

  const nuevoTitulo = await input(`Nuevo título (actual: "${tarea.titulo}") [Enter para mantener]: `);
  if (nuevoTitulo.trim() !== "") {
    if (nuevoTitulo.length > 100) {
      console.log("❌ El título no puede exceder los 100 caracteres.");
      return;
    }
    tarea.titulo = nuevoTitulo;
  }

  const nuevaDescripcion = await input(`Nueva descripción (actual: "${tarea.descripcion}") [Enter para mantener]: `);
  if (nuevaDescripcion.trim() !== "") {
    if (nuevaDescripcion.length > 500) {
      console.log("❌ La descripción no puede exceder los 500 caracteres.");
      return;
    }
    tarea.descripcion = nuevaDescripcion;
  }

  const nuevoVencimiento = await input(`Nueva fecha de vencimiento (actual: "${tarea.vencimiento}") [YYYY-MM-DD o Enter]: `);
  if (nuevoVencimiento.trim() !== "") {
    tarea.vencimiento = nuevoVencimiento;
  }

  const nuevaDificultad = await input(`Nueva dificultad (1 Fácil ⭐, 2 Media ⭐⭐, 3 Alta ⭐⭐⭐) [Enter para mantener]: `);
  if (nuevaDificultad.trim() !== "") {
    switch (nuevaDificultad) {
      case "1":
        tarea.dificultad = "fácil";
        break;
      case "2":
        tarea.dificultad = "intermedia";
        break;
      case "3":
        tarea.dificultad = "difícil";
        break;
      default:
        console.log("❌ Dificultad inválida.");
        return;
    }
  }

  const nuevoEstado = await input(`Nuevo estado (pendiente, en curso, terminada, cancelada) [Enter para mantener]: `);
  if (nuevoEstado.trim() !== "") {
    const estadosValidos = ["pendiente", "en curso", "terminada", "cancelada"];
    if (!estadosValidos.includes(nuevoEstado)) {
      console.log("❌ Estado inválido.");
      return;
    }
    tarea.estado = nuevoEstado;
  }

  tarea.fechaDeEdicion = new Date().toISOString().split("T")[0];
  console.log("✅ Tarea actualizada correctamente.");
}

// ==========================================
// Agrega una nueva tarea con validaciones
// ==========================================
async function agregarTarea() {
  let continuarCrearTarea;

  do {
    const titulo = await input("Ingrese el título de la tarea: ");
    if (!titulo || titulo.trim() === "") {
      console.log("❌ El título no puede estar vacío.");
      return;
    }
    if (titulo.length > 100) {
      console.log("❌ El título no puede exceder los 100 caracteres.");
      return;
    }

    let descripcion = await input("Ingrese la descripción (opcional): ");
    if (!descripcion || descripcion.trim() === "") {
      descripcion = "Sin descripción";
    }
    if (descripcion.length > 500) {
      console.log("❌ La descripción no puede exceder los 500 caracteres.");
      return;
    }

    const fechaCreacion = new Date().toISOString().split("T")[0];
    const fechaDeEdicion = "No editada";

    let vencimiento = await input("Fecha de vencimiento (YYYY-MM-DD) (opcional): ");
    if (!vencimiento || vencimiento.trim() === "") {
      vencimiento = "No asignada";
    }

    let dificultad = await input("Dificultad (1 Fácil ⭐ - 2 Media ⭐⭐ - 3 Alta ⭐⭐⭐): ");
    if (!dificultad || dificultad.trim() === "") {
      dificultad = "1";
    }

    switch (dificultad) {
      case "1":
        dificultad = "fácil";
        break;
      case "2":
        dificultad = "intermedia";
        break;
      case "3":
        dificultad = "difícil";
        break;
      default:
        dificultad = "fácil";
    }

    const estado = "pendiente";

    const tarea = {
      titulo,
      descripcion,
      fechaCreacion,
      vencimiento,
      dificultad,
      estado,
      fechaDeEdicion,
    };

    tareas.push(tarea);
    console.log("✅ Tarea agregada correctamente.");

    continuarCrearTarea = await input("¿Desea agregar otra tarea? [1] Sí / [2] No: ");
  } while (continuarCrearTarea === "1");
}

// ==========================================
// Buscar tareas por estado, dificultad o título
// ==========================================
async function buscarTareas() {
  console.log("\n🔍 Buscar tareas:");
  console.log("[1] Por estado");
  console.log("[2] Por dificultad");
  console.log("[3] Por título");
  console.log("[0] Volver al menú principal");

  const opcion = await input("> ");

  switch (opcion) {
    case "1":
      const estado = await input("Estado a buscar (pendiente, en curso, terminada, cancelada): ");
      const porEstado = tareas.filter(t => t.estado === estado);
      mostrarResultadosBusquedaEstado(porEstado, estado);
      break;

    case "2":
      const dificultad = await input("Dificultad a buscar (fácil, intermedia, difícil): ");
      const porDificultad = tareas.filter(t => t.dificultad === dificultad);
      mostrarResultadosBusquedaEstado(porDificultad, `dificultad ${dificultad}`);
      break;

    case "3":
      const titulo = await input("Título a buscar: ");
      const porTitulo = tareas.filter(t => t.titulo.toLowerCase().includes(titulo.toLowerCase()));
      mostrarResultadosBusquedaEstado(porTitulo, `con título "${titulo}"`);
      break;

      
    case "0":
      return;

    default:
      console.log("❌ Opción inválida. Intenta nuevamente.");
  }
}

// ==========================================
// Muestra tareas filtradas en consola
// ==========================================
function mostrarResultadosBusquedaEstado(tareasFiltradas, criterio) {
  if (tareasFiltradas.length === 0) {
    console.log(`📭 No hay tareas ${criterio}.`);
    return;
  }

  console.log(`\n📋 Tareas ${criterio}:`);
  tareasFiltradas.forEach((tarea, index) => {
    console.log(`#${index + 1}`);
    console.log(`Título: ${tarea.titulo}`);
    console.log(`Descripción: ${tarea.descripcion}`);
    console.log(`Vencimiento: ${tarea.vencimiento}`);
    console.log(`Dificultad: ${tarea.dificultad}`);
    console.log(`Estado: ${tarea.estado}`);
    console.log("-------------------------");
  });

  console.log(`\n🔢 Total: ${tareasFiltradas.length} tareas ${criterio}.`);
}
async function main() {
  await mostrarMenu();
  close();
}


main();