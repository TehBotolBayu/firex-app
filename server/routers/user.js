const express = require('express'),
router = express.Router(),
controller = require('../controllers/user.controllers');
const bodyParser = require('body-parser')
// create application/json parser
const jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// router.post('', jsonParser, controller.createUser);
router.get('/:id', controller.findUser);
router.get('/', controller.findUsers);
router.put('/:id', jsonParser, controller.updateUser);
router.delete('/:id', controller.deleteUser);

module.exports = router;