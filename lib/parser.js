//Dependencies
var url = require('url');

//Path parser
//Returns:
//@integer type: type of path
//@array   paths: list of paths sorted by childs
//
//the following types are:
//0 => static route
//1 => dynamic route (needs matching)
//
//the following matches are:
//0 => integer match
//1 => string match
//2 => integer max length match
//3 => string max length match
module.exports = function Parser(expression) {

}
