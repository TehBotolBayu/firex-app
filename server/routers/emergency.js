const express = require('express'),
router = express.Router(),
controller = require('../controllers/emergency.controllers');
const bodyParser = require('body-parser')
// create application/json parser
const jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

router.post('', jsonParser, controller.createEmergency);
router.get('/:id', controller.findEmergency);
router.get('/', controller.findEmergencies);
router.put('/:id', jsonParser, controller.updateEmergency);
router.delete('/:id', controller.deleteEmergency);

module.exports = router;