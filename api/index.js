var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'welcome to our api!' });
});

module.exports = router;
