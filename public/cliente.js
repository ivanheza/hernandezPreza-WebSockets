const socket = io()
///Constantes

const productList = document.querySelector('#productList')
const productForm = document.querySelector('#productForm')
const chatForm = document.querySelector('#chat-form')
const chatMessages = document.querySelector('#chat-mensajes')

let message = {}
//Event Listener Productos
productForm.addEventListener('submit', (e) => {
  e.preventDefault()

  producto = {
    name: e.target.elements.nombre.value,
    price: e.target.elements.precio.value,
    image: e.target.elements.image.value,
  }
  if (
    producto.name.length == 0 ||
    producto.image.length <= 0 ||
    producto.image.length == 0
  ) {
    alert('Completa todos los campos')
  } else {
    //Emit
    socket.emit('newProduct', producto)
    e.target.elements.nombre.value = ''
    e.target.elements.precio.value = ''
    e.target.elements.image.value = ''
    e.target.elements.nombre.focus()
  }
})

//Event Listener Chat

chatForm.addEventListener('submit', (e) => {
  //console.log("prueba" + input.value)
  e.preventDefault()
  message = {
    username: e.target.elements.userChat.value,
    text: e.target.elements.inputChat.value,
  }

  //console.log(message);
  if (message.username.length == 0 || message.text.length == 0) {
    alert('No Puedes dejar los campos Vacios')

    e.target.elements.userChat.focus()
  } else {
    socket.emit('chatMessage', message)

    e.target.elements.inputChat.value = ''
    e.target.elements.inputChat.focus()
  }
})

///SOCKETS

socket.on('mensaje', (msg) => {
  renderChat(msg)
  //console.log(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight
})

socket.on('products', (data) => {
  //console.log(data);
  renderProducts(data)
})

///RENDER DOM
const renderProducts = (products) => {
  if (products.length > 0) {
    const html = products
      .map((p) => {
        return `
                    <tr>
                       <td>${p.name}</td>
                       <td>${p.price}</td>
                       <td>
                          <img
                             class="img-fluid"
                             src=${p.image}
                             width="100"
                             alt=${p.name}
                          />
                       </td>
                    </tr>
                    `
      })
      .join('')
    productList.innerHTML = html
  } else {
    const html = `
        <tr>
            <td class="text-center" colspan="3">
                <h1 class="fs-1 text-danger">No Hay Productos</h1>
            </td>
        </tr>
      `
    productList.innerHTML = html
  }
}

const renderChat = (data) => {
  //console.log(data.username);
  const div = document.createElement('div')
  div.classList.add('mensaje', 'mb-0')
  div.innerHTML = `<p id="datos" class="opacity-75 badge bg-secondary mb-1">
                     ${data.username}<span class="mx-3 text-dark badge bg-warning">${data.time}</span>
                           </p>
                           <p class="lead">${data.text}</p>`

  chatMessages.appendChild(div)
}
