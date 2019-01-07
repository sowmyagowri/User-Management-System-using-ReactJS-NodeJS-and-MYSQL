var mysql = require('mysql');

var adminpool = mysql.createPool({
    connectionLimit: 100,
    host:'localhost',
    user:'root',
    password:'Sowmya123',
    database:'admin',
    port: 3306,
    debug: false,
    multipleStatements: true
});

module.exports = adminpool;