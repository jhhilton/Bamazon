var mysql = require("mysql");

var inquirer = require("inquirer");

require('console.table');

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	user: "root",

	password: "",
	database: "bamazon_db"
});

var displayItems = function(){

	connection.query('select * from products',function(err,res){
		if (err) throw err;
		console.log("---------------------------------");
		console.table(res);
		console.log("---------------------------------");
		purchaseOrder();
	});
};

var purchaseOrder = function(answers){
	inquirer.prompt([
	{
		name: "whichItem",
		type: "input",
		message: "Enter the Item ID of the item you'd like to buy: "
	},
	{
		name: "itemQuantity",
		type: "input",
		message: "How many units of this item would you like to buy? "
	}
		]).then(function(answer){
	connection.query('SELECT stock_quantity from products WHERE item_id = ' + answer.whichItem + "",function(err,res){
		if (err) throw err;
		currentStock = res[0].stock_quantity;
		if (currentStock < answer.itemQuantity) {
		console.log("---------------------------------");
		console.log("INSUFFICIENT STOCK"); 
		repeatCustomer();
		} else {
	console.log("---------------------------------");
	console.log("ORDER PROCESSED");
	console.log("---------------------------------");
	connection.query("UPDATE products SET stock_quantity = stock_quantity - " + answer.itemQuantity + " WHERE ?", [{
  	item_id: answer.whichItem
	}], function(err, res) {});
	repeatCustomer();
		}
	});

	})

};

var repeatCustomer = function(){

inquirer.prompt([
{
name: "another",
type: "rawlist",
message: "Would you like to make another purchase?",
choices: ["Yes", "No"]
}
]).then(function(answer){
	if (answer.another === "Yes"){
	displayItems();	
	} else {
	connection.end();
	}

})

};

displayItems();

