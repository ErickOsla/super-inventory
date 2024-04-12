var inicioSesion = document.getElementById('form-login');
var codigoEmpleado = document.getElementById('id-login');
var pass = document.getElementById('pass-login');
var nuevoRegistro = document.getElementById('nuevoRegistro');
var nombre = "Carlos"

inicioSesion.addEventListener("submit",function(event){
    event.preventDefault()
    // Envía el objeto JSON con datos usuario y password
    window.comunication.datosInicioSesion([String(codigoEmpleado.value), pass.value]);
})


//envio de datos de nuevo registro
nuevoRegistro.addEventListener('click', function (evento){
    window.comunication.nuevoEmpleado([String(codigoEmpleado.value), pass.value])
})

//mensaje de bienvenida, registro incorrecto, ya existe el usuario
window.comunication.registroIncorrecto(function(event, args){
    alert(args)
})

