
//Aparecer o desaparecer el combo
const ComboTipoRegistro = document.getElementById('ComboTipoRegistro');
const comboCarreras = document.getElementById('comboCarreras');
const spanCarreras = document.getElementById('spanCarreras');

//Validar
const numeroControl = document.getElementById('numeroControl');
const nombre = document.getElementById('nombre');
const paterno = document.getElementById('paterno');
const materno = document.getElementById('materno');

//Listener
const clave = document.getElementById('clave');
const contraseña = document.getElementById('inputPass');
const btn = document.getElementById('buttonPass');
const span = document.getElementById('spanPass');

//Botones
const btnGuardar = document.getElementById('Guardar');
const btnModificar = document.getElementById('Modificar');
const btnEliminar = document.getElementById('Eliminar');
const btnCancelar = document.getElementById('Cancelar');
btnCancelar.style.display = 'none';

//Activar boton al guardar
[numeroControl, nombre, paterno, materno, contraseña]
  .forEach(elemento => {
    elemento.addEventListener('input', validar);
  });
comboCarreras.addEventListener('change', validar);

//Password
btn.addEventListener('click', (e) => {
  e.preventDefault();
  const isText = contraseña.type === 'text';
  contraseña.type = isText ? 'password' : 'text';
  btn.setAttribute('aria-pressed', String(!isText));
  btn.title = isText ? 'Mostrar contraseña' : 'Ocultar contraseña';
});

//Selección de fila
let fila = null;
let seleccionado = false;

function alModificar(){
  btnModificar.disabled = true;
  if(seleccionado && validar()){
    btnModificar.disabled = false;
    btnEliminar.disabled = true;
  }
}
[numeroControl, nombre, paterno, materno, contraseña].forEach(elemento => { //Conjunto de acciones que ocurren al querer modificar Campos
    elemento.addEventListener('input', () => {
      alModificar();
    });
});
comboCarreras.addEventListener('change', ()=>{ //Conjunto de acciones que ocurren al querer modificar Combobox
  alModificar();
});

function alSeleccionar() {
  //Deshabilitar botones
  desactivarBotones();
  //Limpiar campos
  limpiarCampos();
  //Cancelar una modificación
  detenerProceso();
  //Cuando es Auxiliar
  if(ComboTipoRegistro.value === '1'){
    clave.style.display = 'flex';
    span.style.display = 'block';
    //Cambia el número de carácteres
    numeroControl.value = '';
    numeroControl.setAttribute('maxlength', 4);
  }
  //Cuando es Alumno
  if (ComboTipoRegistro.value === '2') { 

    comboCarreras.style.display = 'block';
    spanCarreras.style.display = 'block';
    clave.style.display = 'flex';
    span.style.display = 'block';

    //Cambia el número de carácteres
    numeroControl.value = '';
    numeroControl.setAttribute('maxlength', 8);

    // Llama al PHP para obtener las carreras
      fetch("../../php/Usuarios-LAGP/LlenarComboCarreras.php")
        .then(res => res.json())
        .then(datos => {
          comboCarreras.innerHTML = '<option value="">Seleccione una carrera</option>';
          datos.forEach(c => {
            const option = document.createElement("option");
            option.value = c.id_Carrera;      // Es con lo que se identifica la opción
            option.textContent = c.nombre; // Texto visible
            comboCarreras.appendChild(option);
        });
        })
        .catch(err => {
        console.error("Error:", err);
        comboCarreras.innerHTML = '<option>Error al cargar</option>';
    });
  } else {
    comboCarreras.style.display = 'none';
    spanCarreras.style.display = 'none';
  }
  //Cuando es Docente
  if(ComboTipoRegistro.value === '3'){
    clave.style.display = 'none';
    span.style.display = 'none';
    //Cambia el número de carácteres
    numeroControl.value = '';
    numeroControl.setAttribute('maxlength', 4);
  }
  //Llenar la tabla
  desplegarTabla();
}

function desplegarTabla(){
  fetch('../../php/Usuarios-LAGP/LlenarTabla.php', {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "id=" + encodeURIComponent(ComboTipoRegistro.value)
    })
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#tablaDinamica tbody');
            tbody.innerHTML = ''; // Limpiar tabla

            if(data.length > 0){
                data.forEach(persona => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${persona.id}</td>
                        <td>${persona.nombre}</td>
                        <td>${persona.apellidoPaterno}</td>
                        <td>${persona.apellidoMaterno}</td>
                    `;
                    
                    // Para modificar el elemento
                    tr.addEventListener("click", () => {
                        //Guardamos en una varibale el numero de control
                        fila = persona.id;
                        //Llenar los campos con la fila seleccionada, el event listener recuerda las variables cuando se guardaba
                        numeroControl.value = persona.id;
                        nombre.value = persona.nombre;
                        paterno.value = persona.apellidoPaterno;
                        materno.value = persona.apellidoMaterno;
                        buscarCarrera(persona.id);
                        //Modificar o Eliminar
                        seleccionado = true;
                        btnModificar.disabled = true;
                        numeroControl.readOnly = true;
                        btnEliminar.disabled = false;
                        btnCancelar.style.display = 'block';
                    });

                    tbody.appendChild(tr);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="4">No hay datos</td></tr>';
            }
        })
        .catch(error => {
            console.error('Servicio MySQL Apagado:', error);
            const tbody = document.querySelector('#tablaDinamica tbody');
            tbody.innerHTML = '<tr><td colspan="4">⚠️ Error al cargar los datos</td></tr>';
        });
}

function validar(){
  //Desactivar botón Guardar
  btnGuardar.disabled = true;
  //Validar campos
  if(ComboTipoRegistro.value !== '2' && numeroControl.value.length === 4){
    console.log("Es docente o auxiliar con NC correcto");
  }else if(ComboTipoRegistro.value === '2' && numeroControl.value.length === 8){
    console.log("Es alumno con NC correcto");
    if(comboCarreras.value !== ''){
      console.log('Todo correcto');
    }else{
      return false;
    }
  }else{
    return false;
  }

  if(nombre.checkValidity()){}  else{ return false; }
  if(paterno.checkValidity()){} else{ return false; }
  if(materno.checkValidity()){} else{ return false; }
  //Para reusar el método con la función modificar
  if(seleccionado){
    return true;
  }
  if(ComboTipoRegistro.value === '3' || contraseña.value !== ''){
    console.log("Formulario común correcto");
    //Activar botón guardar
    btnGuardar.disabled = false;
    return true;
  }
}

function buscarCarrera(numeroControl) {
  // Llama al backend para obtener la carrera del alumno
  fetch("../../php/Usuarios-LAGP/BuscarCarrera.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "numeroControl=" + encodeURIComponent(numeroControl)
  })
  .then(response => response.json())
  .then(data => {
    if (data && data.id_Carrera) {
      comboCarreras.value = data.id_Carrera; // Selecciona la carrera en el combo
    } else {
      comboCarreras.value = '';
    }
  })
  .catch(error => {
    console.error("Error al buscar carrera:", error);
  });
}

function guardar(){
  //Ya validados guardarlos en variables
  const ncontrol = numeroControl.value.trim();
  const name = nombre.value.trim();
  const lastname = paterno.value.trim();
  const lastname2 = materno.value.trim();
  const career = comboCarreras.value.trim();
  const password = contraseña.value.trim();

  fetch("../../php/Usuarios-LAGP/Guardar.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "id=" + encodeURIComponent(ComboTipoRegistro.value) +
            "&numeroControl=" + encodeURIComponent(ncontrol) + 
            "&nombre=" + encodeURIComponent(name) + 
            "&apellidoPaterno=" + encodeURIComponent(lastname) + 
            "&apellidoMaterno=" + encodeURIComponent(lastname2) + 
            "&carrera=" + encodeURIComponent(career)+
            "&clave=" + encodeURIComponent(password)
  })
  .then(response => response.text())
  .then(data => {
      mostrarMensaje(data);
      //Limpiar campos
      limpiarCampos();
      desactivarBotones();
      desplegarTabla(); //Recarga la tabla automáticamente
  })
  .catch(error => console.error("Error:", error));  
}

function modificar() {
  const ncontrol = numeroControl.value.trim();
  const name = nombre.value.trim();
  const lastname = paterno.value.trim();
  const lastname2 = materno.value.trim();
  const career = comboCarreras.value.trim();
  const tipo = ComboTipoRegistro.value;
  const pass = contraseña.value.trim();

  fetch("../../php/Usuarios-LAGP/Modificar.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:
      "id=" + encodeURIComponent(tipo) +
      "&numeroControl=" + encodeURIComponent(ncontrol) +
      "&nombre=" + encodeURIComponent(name) +
      "&apellidoPaterno=" + encodeURIComponent(lastname) +
      "&apellidoMaterno=" + encodeURIComponent(lastname2) +
      "&carrera=" + encodeURIComponent(career) +
      "&clave=" + encodeURIComponent(pass)
  })
    .then(response => response.text())
    .then(data => {
      mostrarMensaje(data);
      // Limpiar campos después de modificar
      limpiarCampos();
      fila = null;

      // Recargar la tabla
      desplegarTabla();
    })
    .catch(error => {
      console.error("Error al modificar:", error);
      mostrarMensaje("❌ Ocurrió un error al intentar modificar.");
    });
    //Regresar al modo normal
    detenerProceso();
}

function detenerProceso(){
  //Regresar al modo normal
    btnModificar.disabled = true;
    seleccionado = false;
    numeroControl.readOnly = false;
    btnCancelar.style.display = 'none';
    btnEliminar.disabled = true;
    fila = null;
    limpiarCampos();
}

function eliminar() {
    fetch("../../php/Usuarios-LAGP/Eliminar.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "numeroControl=" + encodeURIComponent(numeroControl.value) +
              "&tipo=" + encodeURIComponent(ComboTipoRegistro.value)
    })
    .then(response => response.text())
    .then(data => {
        mostrarMensaje(data);

        limpiarCampos();

        fila = null;
        desplegarTabla(); // recarga la tabla
    })
    .catch(error => console.error("Error:", error));
    //Regresar al modo normal
    detenerProceso();
}

function limpiarCampos(){
  numeroControl.value = '';
  nombre.value = '';
  paterno.value = '';
  materno.value = '';
  comboCarreras.value = '';
  contraseña.value = '';
}

function desactivarBotones(){
  btnGuardar.disabled = true;
  btnEliminar.disabled = true;
  btnModificar.disabled = true;
}

//Se ejecuta al cargar el html
desactivarBotones();
window.onload = desplegarTabla;