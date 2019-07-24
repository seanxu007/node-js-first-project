const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                require: true
            },
            quantity: {
                type: Number,
                require: true
            }
        }]
    }
});

userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >=0) {
        const newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity
    } else {
        updatedCartItems.push({productId: product._id, quantity: 1});
    }
    const updatedCart = {items: updatedCartItems};
    this.cart = updatedCart;
    return this.save();
};

userSchema.methods.deleteItemFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
};

userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
}

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// const ObjectId = mongodb.ObjectId;

// class User {
//     constructor(username, email, cart, id) {
//         this.name = username;
//         this.email = email;
//         this.cart = cart ? cart : {items: []};
//         this._id = id ? new ObjectId(id) : null;
//     }

//     save() {
//         const db = getDb();
//         let dbOp;
//         if (this._id) {
//             dbOp = db.collection('users').updateOne({_id: this._id}, {$set: this});
//         } else {
//             dbOp = db.collection(users).insertOne(this);
//         }
//         return dbOp.then().catch(err => console.log(err));
//     }

//     addToCart(product) {
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString();
//         });
//         const updatedCartItems = [...this.cart.items];

//         if (cartProductIndex >=0) {
//             const newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity
//         } else {
//             updatedCartItems.push({productId: new ObjectId(product._id), quantity: 1});
//         }
//         const updatedCart = {items: updatedCartItems};
//         const db = getDb();
//         return db.collection('users').updateOne({_id: this._id}, {$set: {cart: updatedCart}});
//     }

//     getCart() {
//         const db = getDb();
//         const productIds = this.cart.items.map(i => {
//             return i.productId;
//         });
//         return db.collection('products')
//             .find({_id: {$in: productIds}})
//             .toArray()
//             .then(products => {
//                 return products.map(p => {
//                     return {
//                         ...p,
//                         quantity: this.cart.items.find(i => {
//                             return i.productId.toString() === p._id.toString();
//                         }).quantity
//                     }
//                 });
//             });
//     }

//     addOrder() {
//         const db = getDb();
//         return this.getCart()
//             .then(products => {
//                 const order = {
//                     items: products,
//                     user: {
//                         _id: this._id,
//                         name: this.name,
//                         email: this.email
//                     }
//                 }
//                 return db.collection('orders').insertOne(order);
//             })
//             .then(result => {
//                 this.cart = {items: []};
//                 return db.collection('users')
//                     .updateOne(
//                         {_id: this._id},
//                         {$set: {cart: {items: []}}}
//                     )
//             });
//     }

//     getOrders() {
//         const db = getDb();
//         return db.collection('orders').find({'user._id': this._id}).toArray();
//     }

//     deleteItemFromCart(productId) {
//         const updatedCartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== productId.toString();
//         });
//         const db = getDb();
//         return db.collection('users').updateOne({_id: this._id}, {$set: {cart: {items: updatedCartItems}}});
//     }

//     static findById(userId) {
//         const db = getDb();
//         return db.collection('users')
//             .findOne({_id: new ObjectId(userId)})
//             .then(user => {
//                 return user;
//             })
//             .catch(err => console.log(err));
//     }
// }

// module.exports = User;