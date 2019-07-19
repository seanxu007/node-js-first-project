const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Product = sequelize.define('product', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     title: Sequelize.STRING,
//     price: {
//         type: Sequelize.DOUBLE,
//         allowNull: false
//     },
//     imageUrl: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     description: {
//         type: Sequelize.STRING,
//         allowNull: false
//     }
// });

// module.exports = Product;

const mongoDb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ?  new mongoDb.ObjectId(id) : null;
        this.userId = userId;
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            dbOp = db.collection('products').updateOne({_id: this._id}, {$set: this});
        } else {
            dbOp = db.collection('products').insertOne(this);
        }
        
        return dbOp
            .then(result => {

            })
            .catch(err => console.log(err));
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products')
            .find()
            .toArray()
            .then(products => {
                return products;
            })
            .catch(err => console.log(err));
    }

    static findById(prodId) {
        const db = getDb();
        return db.collection('products')
            .find({_id: new mongoDb.ObjectId(prodId)})
            .next()
            .then(product => {
                return product;
            })
            .catch(err => console.log(err));
    }

    static deleteById(prodId) {
        const db = getDb();
        return db.collection('products')
            .deleteOne({_id: mongoDb.ObjectId(prodId)})
            .then()
            .catch(err => console.log(err));
    }
}

module.exports = Product;