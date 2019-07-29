const express = require('express');
const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/add-product', auth, adminController.getAddProduct);

router.get('/products', auth, adminController.getProducts);

router.post(
    '/add-product',
    [
        body('title').isString().isLength({min: 3}).trim(),
        body('imageUrl').isURL(),
        body('price').isFloat(),
        body('description').isLength({min: 3, max: 400}).trim()
    ],
    auth,
    adminController.postAddProduct
);

router.get('/edit-product/:productId', auth, adminController.getEditProduct);

router.post(
    '/edit-product',
    [
        body('title').isString().isLength({min: 3}).trim(),
        body('imageUrl').isURL(),
        body('price').isFloat(),
        body('description').isLength({min: 3, max: 400}).trim()
    ],
    auth,
    adminController.postEditProduct
);

router.post('/delete-product', auth, adminController.deleteProduct);

module.exports = router;