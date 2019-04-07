const socket = io()

// server (emit) -> client (receive) --acknowledgement --> server

// client (emit) -> server (receive) --acknowledgement --> client

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')

socket.on('message', (message) => {
    console.log(message);
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')
    
    const message = e.target.elements.message.value
    
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error);
        }
        
        console.log('Message delivered!');
    })
})

$sendLocationButton.addEventListener('click', () => {

    $sendLocationButton.setAttribute('disabled', 'disabled')
    
    if (!navigator.geolocation) {
        $sendLocationButton.removeAttribute('disabled')
        return alert('Geolocation is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition( (position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location Shared');
            $sendLocationButton.removeAttribute('disabled')
        })
    },
    (error) => {
        console.log(error);
        $sendLocationButton.removeAttribute('disabled')
    })
})

// $sendLocationButton.addEventListener('click', () => {
//     $sendLocationButton.setAttribute('disabled', 'disabled')

//     if (!navigator.geolocation) {
//         $sendLocationButton.removeAttribute('disabled')
//         return alert('Geolocation is not supported by your browser')
//     }
 
//     navigator.geolocation.getCurrentPosition(
//         position => {
//             console.log(position);
//             $sendLocationButton.removeAttribute('disabled')
//         },
//         error => {
//             console.log(error);
//             $sendLocationButton.removeAttribute('disabled')
//         })
// })