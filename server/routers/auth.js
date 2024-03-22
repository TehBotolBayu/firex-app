const express = require('express'),
router = express.Router(),
controller = require('../controllers/auth.controllers');
const bodyParser = require('body-parser')
const {revokeToken} = require('../middlewares/auth');

// create application/json parser
const jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/revoke/:id', controller.expireToken)
router.post('/login', jsonParser, controller.login);
router.post('/activate', jsonParser, controller.activate);
router.post('/register', jsonParser, controller.register);
router.post('/validate', jsonParser, controller.validateToken);
router.post('/changepw', jsonParser, controller.changePassword);
// router.get('/:id', controller.findEmergency);
// router.get('/', controller.findEmergencies);
// router.put('/:id', jsonParser, controller.updateEmergency);
// router.delete('/:id', controller.deleteEmergency);

module.exports = router;