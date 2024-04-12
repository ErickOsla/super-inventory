window.comunication.datosEncontrados(function(event, args){
    
    var datosJSON = args
    // Obtener la referencia a la tabla
    var tabla = document.getElementById('tablaProductos');
    var tbody = tabla.getElementsByTagName('tbody')[0];

    // Recorrer los datos JSON y agregar filas a la tabla
    datosJSON.forEach(function(producto) {
        var fila = tbody.insertRow();

        // Agregar celdas a la fila
        for (var key in producto) {
            if (producto.hasOwnProperty(key)) {
                var celda = fila.insertCell();
                celda.textContent = producto[key];
            }
        }

         // Agregar botones a la última celda
         var accionesCelda = fila.cells[fila.cells.length - 1];
         var botonEditar = document.createElement('button');
         botonEditar.textContent = 'Editar';
         botonEditar.addEventListener('click', function() {
             // Lógica para editar el producto
             window.comunication.productoParaEditar(producto);
             console.log('Editar producto: ', producto)
             window.close()
         });
         accionesCelda.appendChild(botonEditar);
 
         var botonSolicitar = document.createElement('button');
         botonSolicitar.textContent = 'Solicitar';
         botonSolicitar.addEventListener('click', function() {
             // Lógica para eliminar el producto
             window.comunication.productoParaSolicitar(producto);
             console.log('Solicitar producto: ', producto.Nombre);
            
         });
         accionesCelda.appendChild(botonSolicitar);
    });
})


 