window.comunication.editarProducto(function(event, args){
    var producto = args
    console.log("producro recibido para editar: ");
    console.log(producto);

    // Asignar los valores del producto a los campos del formulario
    var formulario = document.getElementById('infoProductos');
    formulario['id-producto'].value = producto.idProducto;
    formulario['nombreProducto'].value = producto.nombreProducto;
    formulario['proveedor'].value = producto.nombreProveedor;
    formulario['descripcionProducto'].value = producto.descripcion;
    formulario['categoriaProducto'].value = producto.categoria;
    formulario['unidadesDisponibles'].value = producto.cantidadEnStock;
})

var actualizar = document.getElementById('infoProductos');
var idProducto = document.getElementById('id-producto');
var nombreProducto = document.getElementById('nombreProducto');
var proveedor = document.getElementById('proveedor');
var descripcionProducto = document.getElementById('descripcionProducto');
var categoria = document.getElementById('categoriaProducto');
var unidades = document.getElementById('unidadesDisponibles');

actualizar.addEventListener("submit", function(event){
    event.preventDefault()
    window.comunication.actualizarDatos(
        [parseInt(idProducto.value), nombreProducto.value, proveedor.value, descripcionProducto.value,
        categoria.value, unidades.value]
    )
   window.close()
})

window.comunication.productoActualizado(function(event, args){
    alert(args)
})