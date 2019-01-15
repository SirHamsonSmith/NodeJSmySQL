var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "$H07gun85",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  showAllProducts();
});

function showAllProducts() {
    connection.query("select * from products", function(err, res) {
        if(err) throw err;
        console.log(res)
        askCustomerForItem(res)
    })
}

function askCustomerForItem(inventory) {
    inquirer
        .prompt([
            {
                type: "input",
                name: "choice",
                message: "What is the ID of the item you would like to purcahse? [Quit with q]",
                validate: function(value){
                    return !isNaN(value) || value.toLowerCase()==="q";
                } 
            }
        ]).then(function(value){
            checkIfShouldExit(value.choice)
            var choiceID = parseInt(value.choice)
            var product = checkInventory(choiceID, inventory)
            
            if(product) {
                askCustomerForQuantity(product)
            }else{
                console.log("That item is not in our inventory")
                showAllProducts()
            }
        })
}