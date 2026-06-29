var express = require('express');
var router = express.Router();

// Featured items shown on the landing page (placeholder content).
const featured = [
  { name: 'Classic Glazed', desc: 'Our 1992 original. Light, airy, and gone by 9am.', price: '$1.75', emoji: '🍩' },
  { name: 'Maple Bar', desc: 'Hand-dipped in real maple glaze on a pillowy bar.', price: '$2.50', emoji: '🥞' },
  { name: 'Downtown Cold Brew', desc: 'Slow-steeped 18 hours. Smooth, bold, never bitter.', price: '$3.95', emoji: '☕' }
];

/* GET landing page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Home', featured });
});

module.exports = router;
