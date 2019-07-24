const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoute = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5d31921480c69a4d465b5a42')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        });
});

app.use('/admin', adminRoute);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://node:node-password@cluster0-01e0u.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Sean Xu',
                    email: 'sean.xu85@gmail.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });
        
        app.listen(3000);
    }).catch(err => {console.log(err)});