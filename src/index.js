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

io.on('connection', (socket) => {
    console.log('New WebSocket Connection')

    io.emit('message', 'Welcome!!!')
    socket.broadcast.emit('message', 'A new user had joined!')

    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })

    socket.on('sendLocation', (coords) => {
        if (coords.latitude === undefined || coords.longitude === undefined) {
            return io.emit('message', `https://google.com/maps?q=43.773095,11.257056`)        
        }

        io.emit('message', `Location: ${ coords.latitude },${ coords.longitude }`)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })
})

server.listen(port, () => {
    console.log(`Server is up on http://localhost:${ port }`)
})