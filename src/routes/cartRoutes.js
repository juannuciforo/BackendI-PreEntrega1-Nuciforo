const express = require('express');
const router = express.Router();
const CartManager = require('../models/cartManager');

const cartManager = new CartManager();

// Rutas para carts
router.post('/api/carts/', (req, res) => {
    try {
      const newCart = cartManager.createCart();
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).send(error.message);
    }
});

router.get('/api/carts/:cid', (req, res) => {
    try {
      const cart = cartManager.findCartById(req.params.cid);
      if (typeof cart === 'string') {
        res.send(cart);
      } else {
        res.json(cart);
      }
    } catch (error) {
      res.status(404).send(error.message);
    }
});

router.post('/api/carts/:cid/product/:pid', (req, res) => {
    try {
      cartManager.addProductToCart(req.params.cid, req.params.pid, 1);
      res.status(200).send('Producto agregado al carrito');
    } catch (error) {
      res.status(404).send(error.message);
    }
});

module.exports = router;