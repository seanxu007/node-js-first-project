const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/add-product', auth, adminController.getAddProduct);

router.get('/products', auth, adminController.getProducts);

router.post('/add-product', auth, adminController.postAddProduct);

router.get('/edit-product/:productId', auth, adminController.getEditProduct);

router.post('/edit-product', auth, adminController.postEditProduct);

router.post('/delete-product', auth, adminController.deleteProduct);

module.exports = router;