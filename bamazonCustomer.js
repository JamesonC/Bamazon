var mysql = require("mysql");
// var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "MySQL2019",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    readProducts();
});

function readProducts() {
    console.log("Displaying all available products...\n");
    connection.query("SELECT `item_id`, `product_name`, `price` FROM `bamazon`.`products`", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res);
        connection.end();
    });
}