const { readDataFromFile, writeDataToFile } = require('../utils/fileHandler');
const path = require('path');
const productsFilePath = path.join(__dirname, '../data/productos.json');


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

module.exports = ProductManager;