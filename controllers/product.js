const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    // Pug engine
    // res.render('add-product', {docTitle: 'Add Product', path: '/admin/add-product'});
    // Hbs engine or Ejs engine
    res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product', formsCSS: true, productCSS: true, activeAddProduct: true });
};

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    const products = Product.fetchAll(products => {
        // Pug engine
        // res.render('shop', {prods: products, docTitle: 'Shop', path: '/'});
        // Hbs engine or Ejs engine
        res.render('shop', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
};