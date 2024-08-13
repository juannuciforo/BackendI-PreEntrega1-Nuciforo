const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

const PORT = 8080;
const productsFilePath = 'productos.json';
const cartsFilePath = 'carrito.json';

// Products //

// Funciones auxiliares
const readDataFromFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeDataToFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

class ProductManager {
  constructor() {
    this.products = readDataFromFile(productsFilePath);
  }

  getProducts() {
    if (this.products.length === 0) {
      return 'La lista de productos está vacía.';
    }
    return this.products;
  }

  addProduct({ title, description, code, price, status = true, stock, category, thumbnails = [] }) {
    if (this.products.some(product => product.code === code)) {
      throw new Error('El código del producto ya existe');
    }
    const newProduct = {
      id: this.generateId(),
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails
    };
    this.products.push(newProduct);
    writeDataToFile(productsFilePath, this.products);
    return newProduct;
  }

  getProductById(id) {
    const product = this.products.find(product => product.id == id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return product;
  }

  generateId() {
    return this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
  }
}

const productManager = new ProductManager();

// Rutas para products
app.get('/api/products/', (req, res) => {
  res.json(productManager.getProducts());
});

app.get('/api/products/:pid', (req, res) => {
  try {
    const product = productManager.getProductById(req.params.pid);
    res.json(product);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.post('/api/products/', (req, res) => {
  try {
    const newProduct = productManager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.put('/api/products/:pid', (req, res) => {
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


app.delete('/api/products/:pid', (req, res) => {
  const { pid } = req.params;
  const productIndex = productManager.products.findIndex(product => product.id == pid);
  
  if (productIndex === -1) {
    return res.status(404).send('Producto no encontrado');
  }

  productManager.products.splice(productIndex, 1);
  writeDataToFile(productsFilePath, productManager.products);
  
  res.status(200).send(`Producto con id ${pid} eliminado`);
});

// Carts //

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

// Ruta para crear un nuevo carrito
app.post('/api/carts/', (req, res) => {
  try {
    const newCart = cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Ruta para listar productos en un carrito
app.get('/api/carts/:cid', (req, res) => {
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


// Ruta para agregar un producto a un carrito
app.post('/api/carts/:cid/product/:pid', (req, res) => {
  try {
    cartManager.addProductToCart(req.params.cid, req.params.pid, 1);
    res.status(200).send('Producto agregado al carrito');
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server online en puerto ${PORT}`);
});
