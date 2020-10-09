const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLocationMessage}= require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const app = express()

const server = http.createServer(app)

const io = socketio(server)

const port = process.env.port || 3000

const publicDirectory = path.join(__dirname , '../public')

app.use(express.static(publicDirectory))

//let count = 0;

io.on('connection', (socket)=>{
    
//     socket.emit('countUpdated', count)
//     socket.on('increment', ()=>{
//         count++
//    // socket.emit('countUpdated', count)
//    io.emit('countUpdated', count)
 //  })
 //let message = 'Welcome!' 

 
 console.log("New web socket connection.")

//  socket.on('join', ({username, room}, callback)=>{
    socket.on('join', ( options, callback)=>{

    const {error, user} = addUser({id: socket.id , ...options})
    
    if(error){
        return callback(error)
    }
       
     socket.join(user.room)
     socket.emit('welcomeUser', generateMessage('admin','Welcome!'))
     socket.broadcast.to(user.room).emit('welcomeUser', generateMessage('admin',`${user.username} has joined!`))
     io.to(user.room).emit('roomData', {
         room: user.room,
         users: getUsersInRoom(user.room)
     })
     callback()
 })



socket.on('sendUserMessage', (msg, callback)=>{ 

    const user = getUser(socket.id)
    const filter = new Filter()
    if(filter.isProfane(msg))
{
    return callback('Profanity')
}    
io.to(user.room).emit('welcomeUser', generateMessage(user.username, msg)) 
    callback() 
})

socket.on('sendLocation', (message, callback)=>{
    const user = getUser(socket.id)

    io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${message.latitude},${message.longitude}`))
    callback()
})
    socket.on('disconnect', ()=>{
       const user = removeUser(socket.id)
       if(user){
        io.to(user.room).emit('welcomeUser', generateMessage('admin',`${user.username} has left!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
       }
      
    })
})
 
server.listen(port, ()=>{
    console.log(`Server is up on port ${port}!`)
})