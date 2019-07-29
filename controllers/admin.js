const Product = require('../models/product');
const { validationResult } = require('express-validator/check');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', { 
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        errorMessage: null
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', { 
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            errorMessage: errors.array()[0].msg,
            product: { title: title, imageUrl: imageUrl, price: price, description: description },
            validationErrors: errors.array()
        });
    }

    const product = new Product({title: title, price: price, description: description, imageUrl: imageUrl, userId: req.user});
    product.save()
    .then(result => {
        res.redirect('/admin/products');
    }).catch(err=> {
        console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode) {
        res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findOne({_id: prodId, userId: req.user._id})
        .then((product) => {
            if(!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', { 
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                errorMessage: null
            });
        })
        .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', { 
            pageTitle: 'Add Product',
            path: '/admin/add-product',
            editing: true,
            errorMessage: errors.array()[0].msg,
            product: { _id: prodId, title: title, imageUrl: imageUrl, price: price, description: description },
            validationErrors: errors.array()
        });
    }

    Product.findOne({_id: prodId, userId: req.user._id})
        .then(product => {
            product.title = title;
            product.price = price;
            product.description = description;
            product.imageUrl = imageUrl;
            return product.save()
                .then(result => {
                    res.redirect('/admin/products');
                });
        })
        .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
    Product.find({userId: req.user._id})
        // .select('title price -_id')
        // .populate('userId', 'name')
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.deleteOne({_id: prodId, userId: req.user._id})
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};