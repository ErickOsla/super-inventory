const {ipcRenderer, contextBridge} = require('electron')

contextBridge.exposeInMainWorld(
    'comunication',
    {
        datosInicioSesion: (datos) => ipcRenderer.send('datosInicioSesion', datos)
        ,
        datosEncontrados: (callback) => ipcRenderer.on('datosEncontrados', callback)
        ,
        nuevoEmpleado: (datos) => ipcRenderer.send('nuevoEmpleado', datos)
        ,
        registroIncorrecto: (datos) => ipcRenderer.on('registroIncorrecto', datos)
        ,
        productoParaEditar: (datos) => ipcRenderer.send('productoParaEditar', datos)
        ,
        editarProducto: (callback) => ipcRenderer.on('editarProducto', callback)
        ,
        productoParaSolicitar: (datos) => ipcRenderer.send('productoParaSolicitar', datos)
        ,
        solicitarProducto: (callback) => ipcRenderer.on('solicitarProducto', callback)
        ,
        actualizarDatos: (datos) => ipcRenderer.send('actualizarDatos', datos)
        ,
        productoActualizado: (callback) => ipcRenderer.on('productoActualizado', callback)
        ,
        solicitud: (datos) => ipcRenderer.send('solicitud', datos)
        ,
        productoSolicitado: (callback) => ipcRenderer.on('productoSolicitado', callback)

    }
)


