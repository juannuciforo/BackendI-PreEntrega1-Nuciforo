const { readDataFromFile, writeDataToFile } = require('../utils/fileHandler');
const path = require('path');
const cartsFilePath = path.join(__dirname, '../data/carrito.json');


class CartManager {
    constructor() {
      this.carts = readDataFromFile(cartsFilePath);
    }
  
    createCart() {
      const newCart = {
        id: this.generateId(),
        products: []
      };
      this.carts.push(newCart);
      writeDataToFile(cartsFilePath, this.carts);
      return newCart;
    }
  
    findCartById(cid) {
      const cart = this.carts.find(cart => cart.id == cid);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      if (!cart.products) {
        cart.products = [];
      }
      return cart;
    }
  
    addProductToCart(cid, pid, quantity) {
      try {
        const cart = this.findCartById(cid);
        const productIndex = cart.products.findIndex(p => p.product == pid);
        if (productIndex > -1) {
          cart.products[productIndex].quantity += quantity;
        } else {
          cart.products.push({ product: pid, quantity });
        }
        writeDataToFile(cartsFilePath, this.carts);
      } catch (error) {
        console.error(error.message);
      }
    }
  
    generateId() {
      return this.carts.length > 0 ? Math.max(...this.carts.map(c => c.id)) + 1 : 1;
    }
  }
  
  const cartManager = new CartManager();

module.exports = CartManager;