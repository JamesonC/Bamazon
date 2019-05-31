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

    connection.query("SELECT item_id, product_name, price FROM products", function (err, res) {
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
                validate: function (value) {
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
                validate: function (value) {
                    if (isNaN(value) == false) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        ])
        .then(function (answer, res) {
            var query = "SELECT stock_quantity, price FROM products WHERE ?";
            connection.query(query, {
                item_id: answer.productID
            }, function (err, res) {

                var total = res[0].price * parseInt(answer.units);
                var unitIn = res[0].stock_quantity;
                var unitBuy = parseInt(answer.units);

                // console.log(res);                

                if (unitIn >= unitBuy) {
                    console.log("Thanks for shopping with us!");
                    console.log("Your order total is: " + "$" + total)
                    var newStock = unitIn - unitBuy;

                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [{
                                stock_quantity: newStock
                            },
                            {
                                item_id: answer.itemId
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log("Your order has been placed successfully!");
                            connection.end();
                        }
                    );
                } else {
                    console.log("We currently do not have that many unit in stock!");
                    start();
                }
            });
        });
};