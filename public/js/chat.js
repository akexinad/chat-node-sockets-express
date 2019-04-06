const socket = io()

socket.on('welcomeMessage', (message) => {
    console.log(message);
    
})

socket.on('message', (message) => {
    console.log(message);
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()

    const message = document.querySelector('input').value
    // const message = e.target.elements.message.value
    
    socket.emit('sendMessage', message)
    
})