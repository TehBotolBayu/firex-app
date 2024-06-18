const mqtt = require('mqtt');
const express = require('express');
const app = express();
const routers = require('../routers');
const cors = require('cors');
const {main} = require("./models")

main();

app.use(cors());
app.use('/v1', routers)


const http = require('http').Server(app); 
const io = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
});


io.on('connect', (socket)=>{
    console.log('user conected')

    socket.on('chat',(data)=>{
      io.sockets.emit('chat',data)
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
})


// MQTT broker 
const mqttBrokerUrl = 'mqtt://broker.emqx.io'; 
// const mqttBrokerUrl = 'mqtt://broker.hivemq.com'; 
const mqttTopic = 'firex/asap'; 

// Create MQTT client
const mqttClient = mqtt.connect(mqttBrokerUrl);

// const server = http.createServer((req, res) => {
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.end('Received data from IoT device: ' + dataFromDevice);
// });

// Subscribe to MQTT topic
mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
        // Subscribe to a topic
        mqttClient.subscribe(mqttTopic, function (err) {
            if (!err) {
                console.log('Subscribed to myTopic');
            } else {
                console.error('Error subscribing to myTopic:', err);
            }
        });
        
});

// Handle incoming MQTT messages
mqttClient.on('message', async (topic, message) => {
    // event.preventDefault();

    const msgObj = JSON.parse(message);
    const { ltd, lot, temperature, smoke } = msgObj;
    console.log('Received message from topic:', topic);
    console.log('Message:', message.toString());
    dataFromDevice = message.toString(); // Store received data
    
    const data = await JSON.parse(message)
    // if (inputMessage.trim() !== '') {
      io.emit('message', message);
    // }
});

module.exports = http;

// http.listen(3300, () => console.log(`App is running at PORT ${3300}`))