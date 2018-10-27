var mysql = require("mysql");
var inquirer = require("inquirer");
const spacer = "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$"

// CONNECT TO MYSQL DATABASE WITH LOCAL HOST
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "harmonia_DB"
});

// SET CONNECTION AND OPEN THE STORE WITH WELCOME PROMPT, USER CAN CHOOSE A DEPT TO SHOP
connection.connect(function (err) {
    if (err) throw err;
    openStore();
});

function openStore() {
    inquirer
        .prompt({
            name: "welcome",
            type: "rawlist",
            message: "Welcome to Harmonia Mill, your best web resource for Amazonian goods.  Where would you like to shop today?",
            choices: ["ATTACK", "DEFENSE", "DRESS"]
        })
        .then(function (answer) {
            console.log(answer);

            if (answer.welcome.toUpperCase() === "ATTACK") {
                attack();
            } if (answer.welcome.toUpperCase() === "DEFENSE") {
                defense();
            } if (answer.welcome.toUpperCase() === "DRESS") {
                dress();
            }
        }
        )
}

// DISPLAYS ALL PRODUCTS IN THE ATTACK DEPT
function attack() {
    connection.query("SELECT * FROM harmonia_DB WHERE products", function (err, res) {
        console.log(res);
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err

            for (let i = 0; i < res.length; i++) {
                if (res[i].dept_name === "Attack") {
                    console.log(" - - - - - - - - - - - - - - - ")
                    console.log("item number: " + res[i].id)
                    console.log("item: " + res[i].product_name)
                    console.log("Department: " + res[i].dept_name)
                    console.log("price: $" + res[i].price)
                }
            }
            console.log("solely for self defense purposes, right?")
            console.log("______________________________________")
            whatNext();

        })
    })

}
// DISPLAYS ALL PRODUCTS IN THE DEFENSE DEPT
function defense() {
    connection.query("SELECT * FROM harmonia_DB WHERE products", function (err, res) {
        console.log(res);
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err

            for (let i = 0; i < res.length; i++) {
                if (res[i].dept_name === "Defense") {
                    console.log(" - - - - - - - - - - - - - - - ")
                    console.log("item number: " + res[i].id)
                    console.log("item: " + res[i].product_name)
                    console.log("Department: " + res[i].dept_name)
                    console.log("price: $" + res[i].price)
                }
            }
            console.log("Making enemies in the arcade are we?")
            console.log("______________________________________")
            whatNext();
            
        })
    })
}
// DISPLAYS ALL PRODUCTS IN THE DRESS DEPT
function dress() {
    connection.query("SELECT * FROM harmonia_DB WHERE products", function (err, res) {
        console.log(res);
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err

            for (let i = 0; i < res.length; i++) {
                if (res[i].dept_name === "Dress") {
                    console.log(" - - - - - - - - - - - - - - - ")
                    console.log("item number: " + res[i].id)
                    console.log("item: " + res[i].product_name)
                    console.log("Department: " + res[i].dept_name)
                    console.log("price: $" + res[i].price)
                }
            }
            console.log("A smart choice to update the ol' rags.")
            console.log("______________________________________")
            whatNext();
        })
    })
}
// CUSTOMER CAN EITHER BUY AN ITEM OR RETURN TO OPENING
function whatNext() {
    inquirer
        .prompt({
            name: "whatNext",
            type: "rawlist",
            message: "What would you like to do next?",
            choices: ["MAKE A PURCHASE", "CHANGE DEPARTMENT", "NEVERMIND"]
        })
        .then(function (answer) {
            console.log(answer);

            if (answer.whatNext.toUpperCase() === "MAKE A PURCHASE") {
                buy();
            } if (answer.whatNext.toUpperCase() === "CHANGE DEPARTMENT") {
                openStore();
            } if (answer.whatNext.toUpperCase() === "NEVERMIND") {
                console.log("___________________");
                console.log("Thanks for coming by, may Ares guide your strike and Aphrodite your form.")
                connection.end();
            }
        })
}
// USER CAN PURCHASE AN ITEM WITH THE ITEM ID LISTED
function buy() {
    inquirer
        .prompt([{
            name: "purchase",
            type: "input",
            message: "To make a purchase enter the desired product's Item Number ",
            // validate: validateInput,
            filter: Number
        },
        {
            type: "input",
            name: "quantity",
            message: "How many of this item would you like to purchase?",
            // validate: validateInput,
            filter: Number
        }
        ])
        .then(function (answer) {
            let item = answer.purchase
            let qty = answer.quantity
            let queryStr = 'SELECT * FROM products WHERE ?';

            console.log(item);

            connection.query(queryStr, { id: item }, function (err, res) {
                if (err) throw err

                if (res.length === 0) {
                    console.log(spacer);
                    console.log("I'm sorry but that Item Number does not exsist, please view available items listed above");
                    // display all inventory here maybe??
                    openStore();
                } else {
                    let productDeets = res[0]

                    if (qty <= productDeets.stock_qty)
                        console.log(productDeets.product_name + ": is available! An order has been placed")

                    var updateQueryStr = "UPDATE products SET stock_qty = " + (productDeets.stock_qty - qty)

                    connection.query(updateQueryStr, function (err, data) {
                        if (err) throw err;
                        console.log(spacer);
                        console.log("you're total is $" + productDeets.price * qty)
                        console.log("thank you for you buisness.")
                        whatNext();
                        // connection.end();
                    })
                } if (res[0].stock_qty === 0) {
                    console.log(spacer);
                    console.log("Zeus forgive me! we are out of that item, please select another product from above")
                }
                {
                }
            })
        })
}




//         })
//         .then(function (answer) {
//             console.log(answer);
//             for (let i = 0; i < res.length; i++) {
//                 if (res[i].id === "Attack") 
//             if (answer.buy.toUpperCase() === "MAKE A PURCHASE") {
//                 buy();
//             } if (answer.whatNext.toUpperCase() === "CHANGE DEPARTMENT") {
//                 openStore();
//             }
//         })
// }

// }
