/*
object:unset
*/"use strict"

var forIn = require("./forIn")

var unset = function(self, key){
    var value = self[key]
    delete self[key]
    return value
}

module.exports = unset