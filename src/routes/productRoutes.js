const express = require('express');
const router = express.Router();
const ProductManager = require('../dao/productManager');

const productManager = new ProductManager();

// Rutas para products
router.get('/', (req, res) => {
    res.json(productManager.getProducts());
});

router.get('/:pid', (req, res) => {
    try {
      const product = productManager.getProductById(req.params.pid);
      res.json(product);
    } catch (error) {
      res.status(404).send(error.message);
    }
});

router.post('/', (req, res) => {
    try {
      const newProduct = productManager.addProduct(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).send(error.message);
    }
});

router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const productIndex = productManager.products.findIndex(product => product.id == pid);
    
    if (productIndex === -1) {
      return res.status(404).send('Producto no encontrado');
    }
  
    // Actualizar solo los campos enviados desde el body pero excluyendo el id
    const updatedFields = req.body;
    delete updatedFields.id; // Asegurarse de que el id no se actualice
    productManager.products[productIndex] = { ...productManager.products[productIndex], ...updatedFields };
    writeDataToFile(productsFilePath, productManager.products);
    
    res.json(productManager.products[productIndex]);
});

router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    const productIndex = productManager.products.findIndex(product => product.id == pid);
    
    if (productIndex === -1) {
      return res.status(404).send('Producto no encontrado');
    }
  
    productManager.products.splice(productIndex, 1);
    writeDataToFile(productsFilePath, productManager.products);
    
    res.status(200).send(`Producto con id ${pid} eliminado`);
});

module.exports = router;
