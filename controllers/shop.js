const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    const products = Product.fetchAll(products => {
        // Pug engine
        // res.render('shop', {prods: products, docTitle: 'Shop', path: '/'});
        // Hbs engine or Ejs engine
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Shop',
            path: '/products',
        });
    });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.id;
    Product.findById(prodId, product => {
        res.render('shop/product-detail', {
            product: product,
            path: '/products',
            pageTitle: product.title
        });
    });
};

exports.getIndex = (req, res, next) => {
    const products = Product.fetchAll(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
        });
    });
};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({productData: product, qty: cartProductData.qty});
                }
            }
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });
        });
    });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
}

exports.cartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
    });
    res.redirect('/cart');
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    });
};

