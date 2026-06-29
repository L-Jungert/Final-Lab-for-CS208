var express = require('express');
var router = express.Router();

// Placeholder menu data -- the client will provide final items/prices from their PDF menu.
const menu = {
  Donuts: [
    { name: 'Classic Glazed', desc: 'Lorem ipsum dolor sit amet, our 1992 original.', price: '$1.75' },
    { name: 'Chocolate Old-Fashioned', desc: 'Consectetur adipiscing, rich cocoa cake donut.', price: '$2.00' },
    { name: 'Maple Bar', desc: 'Sed do eiusmod, real maple glaze.', price: '$2.50' },
    { name: 'Strawberry Sprinkle', desc: 'Tempor incididunt, rainbow sprinkles.', price: '$2.25' },
    { name: 'Apple Fritter', desc: 'Ut labore et dolore, cinnamon & fresh apple.', price: '$3.25' },
    { name: 'Boston Cream', desc: 'Magna aliqua, custard-filled & chocolate-topped.', price: '$2.75' }
  ],
  Coffee: [
    { name: 'Drip Coffee', desc: 'Ut enim ad minim, locally roasted.', price: '$2.25' },
    { name: 'Latte', desc: 'Quis nostrud exercitation, silky steamed milk.', price: '$4.25' },
    { name: 'Downtown Cold Brew', desc: 'Ullamco laboris, steeped 18 hours.', price: '$3.95' },
    { name: 'Hot Cocoa', desc: 'Nisi ut aliquip, topped with whip.', price: '$3.00' }
  ],
  Seasonal: [
    { name: 'Pumpkin Spice Cake', desc: 'Duis aute irure, fall favorite.', price: '$2.75' },
    { name: 'Lemon Lavender', desc: 'Dolor in reprehenderit, bright & floral.', price: '$2.75' }
  ]
};

// Online ordering partners -- swap in the client's real store URLs.
const ordering = [
  { name: 'UberEats', url: 'https://www.ubereats.com', label: 'Order on UberEats' },
  { name: 'DoorDash', url: 'https://www.doordash.com', label: 'Order on DoorDash' }
];

/* GET menu page. */
router.get('/', function (req, res, next) {
  res.render('menu', { title: 'Menu', menu, ordering });
});

module.exports = router;
