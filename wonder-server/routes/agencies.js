const express = require('express');
const router = express.Router();
const agencyController = require('../controllers/agencyController');

router.get('/', agencyController.getAgencies);
router.post('/register', agencyController.registerAgency);

module.exports = router;
