const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('k:mm:ss')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (location) => {
    console.log(location);
    const html = Mustache.render(locationMessageTemplate, {
        location: location.url,
        createdAt: moment(location.createdAt).format('k:mm:ss')
    })
    $messages.insertAdjacentHTML('beforeend', html)
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
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition( (position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Shared');
        })
    },
    (error) => {
        $sendLocationButton.removeAttribute('disabled')
        console.log(error);
        socket.emit('sendLocation', {
            latitude: 43.773075,
            longitude: 11.257014
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Shared');
        })
    })
})

socket.emit('join', { username, room })

// ERROR CODE TO POST ON STACKOVERFLOW

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