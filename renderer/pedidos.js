window.comunication.solicitarProducto(function(event, args){
    var producto = args
    console.log("producro recibido para solicitar: ");
    console.log(producto);

    // Asignar los valores del producto a los campos del formulario
    var formulario = document.getElementById('form-pedido');
    formulario['id-producto'].value = producto.idProducto;
    formulario['nombreProducto'].value = producto.nombreProducto;
    formulario['nombreProveedor'].value = producto.nombreProveedor;
})

var solicitarPedido = document.getElementById('form-pedido');
var idProducto = document.getElementById('id-producto');
var nombreProducto = document.getElementById('nombreProducto');
var proveedor = document.getElementById('nombreProveedor');
var cantidadSolicitar = document.getElementById('cantidad');

solicitarPedido.addEventListener("submit", function(event){
    event.preventDefault()

    console.log(idProducto.value)

    window.comunication.solicitud(
        [parseInt(idProducto.value), nombreProducto.value, 
        proveedor.value, cantidadSolicitar.value])
   
    
})

window.comunication.productoSolicitado(function(event, args){
    alert(args)
})

