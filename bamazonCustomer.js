var mysql = require("mysql");
var inquirer = require("inquirer");

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
        start();
        // connection.end();
    });
}

function start() {
    inquirer
        .prompt([{
                name: "productID",
                type: "input",
                message: "What is the product_id you would like to buy?",
                validate: function(value) {
                    if (isNaN(value) == false) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            {
                name: "units",
                type: "input",
                message: "How many units of the product do you want to buy?",
                validate: function(value) {
                    if (isNaN(value) == false) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        ])
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            // if (answer.postOrBid === "POST") {
            //  postAuction();
            // } else if (answer.postOrBid === "BID") {
            //   bidAuction();
            //} else {
            connection.end();
            // }
        });
}
