const express = require('express'),
router = express.Router(),
controller = require('../controllers/sensor.controllers');
const bodyParser = require('body-parser')

// create application/json parser
const jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })
router.get('/withuser/', controller.getSensorUser)
router.post('/', jsonParser, controller.createSensor);
// router.get('/devices', controller.sensorUser);
router.get('/', controller.findSensors);
router.get('/:id', controller.findSensor);
router.put('/:id', jsonParser, controller.updateSensor);
router.delete('/:id', controller.deleteSensor);

module.exports = router;

// getSensorUser