//Socket
const express = require('express')
const app = express()
//Modulos
const Producto = require('./productos')
const formatoMensaje = require('./utils/mensajes')
//Socket
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)
const port = 3000
const path = require('path')
//handlebars
const { engine } = require('express-handlebars')
//server
httpServer
  .listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
  })
  .on('error', (error) => console.log(`Error en servidor ${error}`))
// Codificacion
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

let listaProductos = []
let mensajes = []

///Configuracion Handlebars
app.engine(
  '.hbs',
  engine({
    extname: '.hbs', //extension
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
  })
)
//espacio Publico del servidor
app.use(express.static('./public'))
/// se establece el directorio
app.set('views', path.join(__dirname, 'views'))
///se establece el motor
app.set('view engine', 'hbs')

///HOME

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Proyecto Web Sockets',
    path: '/',
    link: '',
  })
})

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado')
  //Bienvenida
  io.emit('mensaje', formatoMensaje('Bot Servidor', 'Un cliente se ha unido'))

  io.emit('products', listaProductos)

  socket.on('chatMessage', (msg) => {
    const mensaje = formatoMensaje(msg.username, msg.text)

    io.emit('mensaje', mensaje)
  })

  /// Socket New Product

  socket.on('newProduct', (product) => {
    const producto = new Producto(product.name, product.price, product.image)
    producto.nuevoProducto(listaProductos)
    //console.log(listaProductos)
    io.emit('products', listaProductos)
  })

  //El usuario se desconectó

  socket.on('disconnect', () => {
    console.log('Se Desconecto Usuario')
  })
})
