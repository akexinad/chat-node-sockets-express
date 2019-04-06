const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3001
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let count = 0

// server (emit) -> client (recieve) - countUpdated
// client (emit) -> server (revieve) - increment

io.on('connection', (socket) => {
    console.log('New WebSocket Connection')

    io.emit('welcomeMessage', 'Hello World!')

    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })
})

server.listen(port, () => {
    console.log(`Server is up on http://localhost:${ port }`)
})