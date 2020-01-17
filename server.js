const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dburl = "mongodb+srv://tyelf22:Nike2299@cluster0-z9s3e.mongodb.net/test?retryWrites=true&w=majority"


let bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

let http = require('http').Server(app)
let io = require('socket.io')(http)

let server = app.listen(3000, () => {
    console.log('server is running on port', server.address().port)
})

app.use(express.static(__dirname))

mongoose.connect(dburl, (err) => {
    console.log('mongodb connected', err)
})

let Message = mongoose.model('Message', {name: String, message: String})

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) =>{
        res.send(messages)
    })
})

app.post('/messages', (req, res) => {
    let message = new Message(req.body)
    message.save((err) => {
        if(err) 
            sendStatus(500)
          io.emit('message', req.body)
          res.sendStatus(200)
    })
})


io.on('connection', () => {
    console.log('a user conenected')
})


