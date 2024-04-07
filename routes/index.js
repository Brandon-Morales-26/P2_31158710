var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', {
 title: 'Hola Mundo',
 Name:'Brandon Josue',
 Lastname:'Morales Marchan',
 Id:'31158710',
 section:'2',
 });
});

module.exports = router;
