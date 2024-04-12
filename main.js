const { app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const saltRounds = 10


const conexion = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'gundam-00',
  database:'pfpasupermercado'
})

let ventana;
let ventana2;
let ventana3;
let ventana4;

//=============================== creacion de ventanas======================
function createWindowLogin() {
    ventana = new BrowserWindow({
        width: 400,
        height: 400,
        webPreferences: {
            preload: path.join(app.getAppPath(),'preload.js')
        } 
        
    });
    ventana.loadFile(path.join(__dirname,'./renderer/inicio-sesion.html'));
}

function createWindow2(){
    ventana2 = new BrowserWindow({
        width: 1250,
        height: 900,
        webPreferences: {
          preload: path.join(app.getAppPath(),'preload.js')
        }
    });
    ventana2.loadFile(path.join(__dirname,'./renderer/productos-disponibles.html'));
  }

  function createWindow3(){
    ventana3 = new BrowserWindow({
        width: 450,
        height: 650,
        alwaysOnTop: true,
        webPreferences: {
          preload: path.join(app.getAppPath(),'preload.js')
        }
    });
    ventana3.loadFile(path.join(__dirname,'./renderer/edicion-info-productos.html'));
  }

  function createWindow4(){
    ventana4 = new BrowserWindow({
        width: 450,
        height: 500,
        alwaysOnTop: true,
        webPreferences: {
          preload: path.join(app.getAppPath(),'preload.js')
        }
    });
    ventana4.loadFile(path.join(__dirname,'./renderer/pedidos.html'));
  }




//================================== validacion registros login===================
ipcMain.on('datosInicioSesion',function(event,args){
  console.log("datos ingresados inicio sesion: ")
  console.log(args)

  conexion.promise().execute('SELECT * FROM empleados WHERE codigoEmpleado = ?',
  [args[0]])
  .then(([results, fields])=>{
      console.log(results)
      if(results.length > 0){
          return bcrypt.compare(args[1], results[0]['pass'])
      }
  })
  .then((results)=>{
      console.log(results)
      if(results){ 
          conexion.promise().execute('SELECT idProducto, nombreProducto, nombreProveedor, descripcion, categoria, cantidadEnStock, acciones FROM productos_inventario')
          .then(([Productos, fields])=>{
            //console.log(Productos)
              createWindow2()
              ventana2.webContents.on('did-finish-load',function(){
                  ventana2.webContents.send('datosEncontrados', Productos)
              })
          })
      }else{
          console.log('No existe usuario')
      }
  })
})



//===============================INGRESO DE NUEVO REGISTRO DE EMPLEADO==============

// Recibe datos de nuevo ingreso y envia querry a base de datos
ipcMain.on('nuevoEmpleado',function(event,args){
  console.log("nuevo registro ingresado: ")
  console.log(args)
  
  bcrypt.hash(args[1], saltRounds)
      .then((hash) => {
          console.log("clave hash a para insert: ")
          console.log(hash)
          return conexion.promise().execute('INSERT INTO empleados(codigoEmpleado,pass) VALUES(?,?)',// lo que importa es el orden en que esta "args" y ***ambos deben ser STRING PARA QUE FUNCIONE EL HASHING
          [args[0], hash])
      })
      .then(([results,fields])=>{
          console.log(results)
          if(results.affectedRows>0){
            createWindow2();
            ventana2.webContents.on('did-finish-load', function() {
                ventana2.webContents.send('datosEncontrados', listaProductos);
          });
          }

      })
      .catch((err)=> {
          console.log(err)
          if(err.code == 'ER_DUP_ENTRY'){
              ventana.webContents.send('registroIncorrecto', 'Nombre de usuario ya utiliza')
          }
      })
})




//================================ envio de objeto producto a ventana para editar=====
ipcMain.on('productoParaEditar', function(event, args){
  var objetoProducto = args;
  createWindow3();
          ventana3.webContents.on('did-finish-load', function() {
              ventana3.webContents.send('editarProducto', objetoProducto);
        });
});

//=================================== objeto producto a ventana pedidos=================
ipcMain.on('productoParaSolicitar', function(event, args){
  var objetoProducto = args;
  createWindow4();
          ventana4.webContents.on('did-finish-load', function() {
              ventana4.webContents.send('solicitarProducto', objetoProducto);
        });
});

//============================= actualizar datos=============
ipcMain.on('actualizarDatos', function(event, args){
  var idProducto = args[0];
  var nombreProducto = args[1];
  var proveedor = args[2];
  var descripcionProducto = args[3];
  var categoria = args[4];
  var cantidad = args[5];

  // Ejecutar la consulta SQL de actualización en la base de datos
  conexion.promise().execute('UPDATE productos_inventario SET nombreProducto = ?, nombreProveedor = ?, descripcion = ?, categoria = ?, cantidadEnStock = ? WHERE idProducto = ?',
      [nombreProducto, proveedor, descripcionProducto, categoria, cantidad, idProducto])
  .then((recargarVentana)=>{
    event.reply('productoActualizado', 'Cambios Guardados');
    conexion.promise().execute('SELECT idProducto, nombreProducto, nombreProveedor, descripcion, categoria, cantidadEnStock, acciones FROM productos_inventario')
      .then(([Productos, fields])=>{
        //console.log(Productos)
          createWindow2()
          ventana2.webContents.on('did-finish-load',function(){
              ventana2.webContents.send('datosEncontrados', Productos)
          })
      })
  })
  .catch(error => {
      // Enviar un mensaje de error al cliente en caso de que ocurra algún problema durante la actualización
      event.reply('error', 'Error al actualizar datos');
  });
});

//============================== solicitar producto, insertar datos en tabla pedido======

ipcMain.on('solicitud', function(event, args){
  console.log("productos solicidatos: ")
  console.log(args)
  var idProducto = args[0];
  var nombreProducto = args[1];
  var proveedor = args[2];
  var cantidad = args[3];

  // Ejecutar la consulta SQL de actualización en la base de dato
  conexion.promise().execute('INSERT INTO pedidos_producto_proveedor(idProducto,nombreProducto,proveedor,cantidad,fecha) VALUES(?,?,?,?,CURRENT_TIMESTAMP)',
      [idProducto,nombreProducto, proveedor, cantidad])

  .then(() => {
    // Enviar una respuesta al cliente para indicar que los datos se han actualizado correctamente
    event.reply('productoSolicitado', 'Solicitud Procesada');        
    
  })
  .catch(error => {
      console.error(error)
      // Enviar un mensaje de error al cliente en caso de que ocurra algún problema durante la actualización
      event.reply('error', 'Error al solicitar datos');
  });
});

app.whenReady().then(createWindowLogin)

