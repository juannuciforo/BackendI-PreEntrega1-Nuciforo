const express = require('express');
const app = express();
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});