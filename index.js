const express = require('express');
const bodyParser = require('body-parser');
const Pusher = require('pusher');

const pusherConfig = require('./pusher.json'); // (1)
const pusherClient = new Pusher(pusherConfig);

const app = express(); // (2)
app.use(bodyParser.json());

const PORT  =  4000

app.get('/', function(req, res) { // (3)
    console.log(' hi: ');
    res.send("hi");
});
app.put('/users/:name', function(req, res) { // (3)
    console.log('User joined: ' + req.params.name);
    pusherClient.trigger('chat_channel', 'join', {
        name: req.params.name
    });
    res.sendStatus(204);
});

app.delete('/users/:name', function(req, res) { // (4)
    console.log('User left: ' + req.params.name);
    pusherClient.trigger('chat_channel', 'part', {
        name: req.params.name
    });
    res.sendStatus(204);
});

app.post('/users/:name/messages', function(req, res) { // (5)
    console.log('User ' + req.params.name + ' sent message: ' + req.body.message);
    pusherClient.trigger('chat_channel', 'message', {
        name: req.params.name,
        message: req.body.message
    });
    res.sendStatus(204);
});

// SINGLE FUNCTION *
app.post('/users/sendMessage', function(req, res) { // (5)
    console.log('Configs: ' + req.body.messageBody);
    let body =  req.body.messageBody
    pusherClient.trigger( body.chatId, 'message', {
        name: body.name,
        message: body.message
    });
    res.sendStatus(204);
});

app.listen(PORT, function() { // (6)
    console.log('Maqthab pusher app listening on port 4000');
});
