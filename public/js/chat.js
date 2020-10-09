const socket = io()
// console.log(socket)
// socket.on('countUpdated', (count)=>{
//     console.log("The count has been updated!", count)
   
// })
// document.querySelector('#incrementCount').addEventListener('click', ()=>{
//     console.log('clicked')
//     socket.emit('increment')
// })

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-loc')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}


socket.on('welcomeUser', (msg)=>{
    console.log(msg)
const html = Mustache.render(messageTemplate, {
    username: msg.username,
    message: msg.text,
    createdAt: moment(msg.createdAt).format('h:mm a')
})
$messages.insertAdjacentHTML('beforeend', html)
autoscroll()

})

socket.on('locationMessage', (message)=>{
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url : message.url, 
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
   
})

socket.on('roomData', ({room, users})=>{
    const html = Mustache.render(sidebarTemplate, {
        room, 
        users
    })

   document.querySelector('#sidebar').innerHTML = html 
   
}) 


$messageForm .addEventListener('submit', (e)=>{
    e.preventDefault()
//    let msg = document.querySelector('input').value;

// Disable button
$messageFormButton.setAttribute('disabled', 'disabled')

let msg = e.target.elements.message.value
   socket.emit('sendUserMessage', msg, (error)=>{
     
    // Enable 
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()
    if(error){
        return console.log(`${error} is not allowed here!`)
    }
       console.log('The message has been deliverd.')
   })
})

$sendLocationButton.addEventListener('click', ()=>{
    if(!navigator.geolocation){
        return alert('Your current browser does not support geolocation.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
     
        socket.emit('sendLocation', {
            latitude:position.coords.latitude,
            longitude: position.coords.longitude
        }, ()=>{

            console.log('Location Shared.')
           
            $sendLocationButton.removeAttribute('disabled')
        })

    })
})
 socket.emit('join', {username, room}, (error)=>{
      if(error){
          alert(error)
          location.href = '/'
      }
 })









