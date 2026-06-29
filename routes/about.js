var express = require('express');
var router = express.Router();

const timeline = [
  { year: '1992', text: 'Lorem ipsum -- the Doe family opens Downtown Donuts on Main Street with one fryer and a hand-painted sign.' },
  { year: '2001', text: 'Consectetur adipiscing -- we add our now-famous cold brew and expand the seating area.' },
  { year: '2014', text: 'Sed do eiusmod -- voted "Best Donut Downtown" three years running.' },
  { year: 'Today', text: 'Tempor incididunt -- still family-owned, still frying fresh every morning at 5am.' }
];

/* GET about page. */
router.get('/', function (req, res, next) {
  res.render('about', { title: 'About Us', timeline });
});

module.exports = router;
