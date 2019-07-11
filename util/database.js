const Sequelize = require('sequelize');

const sequlize = new Sequelize('node-shopping-project', 'node', 'node-password', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports=sequlize;