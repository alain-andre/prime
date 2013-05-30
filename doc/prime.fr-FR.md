package: prime
==============

 1. fondamental, basic, essentiel.
 2. façonne (quelque chose) à l'utilisation ou à l'action.
 3. archétypal, prototypique, typique, classique.

**Prime** est un assistant à l'héritage prototypique.

module: prime
-------------

### produits

Le module prime fournit une fonction qui peut créer de nouveaux _primes_.
La fonction retourne une méthode `constructor`, complétée par
la méthode `implements`.

### paramètres

1. properties - (*object*) Un objet qui contient les propriétés et méthodes
qui seront appliquées sur le constructeur.

### propriété: constructor

Lorsqu'une methode est passée avec la clé `constructor`, elle va devenir votre prime.
Toutes les propriétés suivantes (sauf particulières) s'appliqueront sur ce constructeur comme des prototypes.

### propriété: inherits

Lorsqu'un objet est passé avec la clé `inherits` en tant que propriété, votre construteur va 
hériter des prototypes passés par cet objet.

### échantillon

```js
// require prime
var prime = require('prime')

// create a new prime
var Point = prime({
    // constructor
    constructor: function(x, y){
        this.x = x
        this.y = y
    }
})

// another prime
var Shape = prime({
    constructor: function(point){
        this.position = point
    },
    // an area méthode
    area: function(){
        return 0
    },
    // circumference méthode
    circumference: function(){
        return 0
    }
})

var Circle = prime({
    // Circle inherits from Shape
    inherits: Shape,
    constructor: function(point, radius){
        // call Shape constructor
        Shape.call(this, point)
        this.radius = radius
    },
    // override area and circumference methods
    area: function(){
        return Math.PI * this.radius * this.radius
    },
    circumference: function(){
        return 2 * Math.PI * this.radius
    }
})

var Rectangle = prime({
    // like Circle, Rectangle also inherits from Shape
    inherits: Shape,
    constructor: function(point, a, b){
        Shape.call(this, point)
        this.a = a
        this.b = b
    },
    area: function(){
        return this.a * this.b
    },
    circumference: function(){
        return 2 * (this.a + this.b)
    }
})

// instantiate a new point
var point = new Point(20, 40)
// create a new circle
var circle = new Circle(point, 10)
// calculate the circumference of the circle
circle.circumference() // 20π
// Create a new rectangle and calculate its area
var rectangle = new Rectangle(point, 10, 20)
rectangle.area() // 200
```

méthode: prime:implement
-----------------------
Le constructeur retourné par `prime()` est étendu avec une méthode `implement`.
Il implémente de nouvelles méthodes sur le prototype du constructeur.
La fonction retourne le constructeur.

### syntaxe

```js
MyPrime.implement(methods)
```

### paramètres

1. methods - (*object*) Un objet avec des clés:valeurs qui représentent des noms de prototype et
leurs méthodes.

### échantillon

```js
Circle.implement({
    draw: function(){
        this.ctx.beginPath()
        this.ctx.arc(this.position.x, this.position.y, this.radius,
            0, 2 * Math.PI, false)
        this.ctx.fillStyle = "#8ED6FF"
        this.ctx.fill()
    }
})
```

fonction: prime.each
--------------------

Itère toutes les propriétés d'un objet, incluant celles normalement non itérables dans Internet Explorer, 
tel que `toString` et `valueOf`.
Cette fonction retourne le premier argument `object`.

### syntaxe

```js
prime.each(object, fonction)
```

### paramètres

1. object - (*object*) L'objet à itérer.
2. fonction - (*fonction*) La fonction appelée pour chaque propriété.
3. context - (*object*) La condition passée à la fonction.

### échantillon

```js
// alerts 'The first day of the week is Sunday'
// 'The second day of the week is Monday', etc.:
var days = {first: 'Sunday', second: 'Monday', third: 'Tuesday'}
prime.each(days, function(value, key){
    alert('The ' + key + ' day of the week is ' + value)
})
```

fonction: prime.has
-------------------

Vérifie si l'objet possède la clé spécifiée comme une de ses propres propriétés (n'incluant pas 
les propriétés trouvées dans la chaîne prototype). Retourne `true` si c'est
le cas, sinon, elle retourne `false`.

### paramètres

1. object - (*object*) L'objet.
2. property - (*string*) Le nom de la propriété à rechercher.

### échantillon

```js
// A simple plain object
var object = {color: 'red'}
// Circle prime, from the prime example
var circle = new Circle(new Point(10, 30), 4)
prime.has(object, 'color') // true
prime.has(object, 'size') // false
prime.has(circle, 'radius') // true (defined in the Circle constructor)
prime.has(circle, 'circumference') // false (it is only on the prototype)
// compared to the 'in' operator
'circumference' in circle // true
```

### à voir aussi

[MDN Object.hasOwnProperty](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)

fonction: prime.create
----------------------

Crée une nouvelle instance d'un constructeur vide, dont le prototype prend la valeur de l'objet 
passé. Ceci est principalement utilisé pour l'héritage, pour instancier un prime
sans avoir à invoquer son constructeur. Il utilise l'`Object.create` natif
le cas échéant. Sauf si vous avez une raison très particulière d'utiliser ceci, vous devriez
Utilisez `prime` au lieu de cela et sa meta-méthode `inherits`.

### syntaxe

```js
prime.create(proto)
```

### paramètres

- proto - (*object*) Le prototype du constructeur vide instancié.
Retourne l'object créé.

### Retours

- (*object*) Une instance du constructeur vide.

### échantillon

```js
var object = prime.create({
    set: function(key, value){
        this[key] = value
    },
    get: function(key){
        return this[key]
    }
})
object.set('foo', 'bar')

// for inheritance
var Square = function(size){
    Rectangle.call(this, size, size)
}

// makes Square inherit from Rectangle, without having to instantiate a new Rectangle
Square.prototype = prime.create(Rectangle.prototype)

var square = new Square(5)
square.area() // 25
```

### à voir aussi

[MDN Object.create](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create)

fonction: prime.define
----------------------

Définit une propriété sur un objet et le retourne.
Le descripteur devrait au moins avoir la propriété `value`. Les autres propriétés de descripteur
sont uniquement prises en charge dans les environnements compatibles ES5.

### échantillon

```js
var object = {}
prime.define(object, 'number', {
    value: 1,
    enumerable: false
})

console.log(object.number) // 1
```

### paramètres

1. object (*object*) L'objet sur lequel définir la propriété.
2. key (*string*) Le nom de la propriété.
3. descriptor (*object*) Un descripteur de propriété pour la propriété en cours de définition.

### à voir aussi

[MDN Object.defineProperty](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty)

module: es5/array
=================
#TODO
This module contains ECMAScript 5 array methods as generics.
Native JavaScript methods will always get invoked where available,
otherwise a compliant JavaScript substitute will be used.

produits
-------

The module produits an object containing all the array methods.

```js
var array = require('prime/es5/array')
array.indexOf([1, 2, 3], 2) // 1
```

All ES3 Array methods are added as generics as well:

```js
(function(){
    var args = array.slice(arguments) // [1, 2, 3]
    array.push(args, 4) // [1, 2, 3, 4]
})(1, 2, 3)
```

### note

`array` is a [shell](#module-shell).

méthode: filter
--------------

Returns a new array with the elements of the original array for which the
provided filtering fonction returns `true`.

### syntax

```js
var filteredArray = array.filter(myArray, fn[, context])
```

### paramètres

1. myArray - (*array*) The array to filter.
1. fn - (*fonction*) The fonction to test each element of the array. This
fonction is passed the item and its index in the array.
2. context - (*object*, optional) The object to use as 'this' in the fonction.

#### parameter: fn

##### syntax

```js
fn(item, index, array)
```

##### arguments

1. item   - (*mixed*) The current item in the array.
2. index  - (*number*) The current item's index in the array.
3. array  - (*array*) The actual array.

### échantillon

```js
var biggerThanTwenty = array.filter([10, 3, 25, 100], function(item, index){
    return item > 20
}) // biggerThanTwenty = [25, 100]
```

### à voir aussi:

[MDN Array:filter](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/filter)

méthode: indexOf
---------------

Returns the index of the first element within the array equal to the specified
value, or -1 if the value is not found.

### paramètres

1. item - (*object*) The item to search for in the array.
2. from - (*number*, optional: defaults to 0) The index of the array at which
to begin the search.

### samples

```js
array.indexOf(['apple', 'lemon', 'banana'], 'lemon') // returns 1
array.indexOf(['apple', 'lemon'], 'banana'); // returns -1
```

### à voir aussi

[MDN Array:indexOf](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf)

méthode: map
-----------

Creates and returns a new array with the results of calling a provided fonction
on every element in the array.

### syntax

```js
var mappedArray = array.map(myArray, fn[, context])
```

### paramètres

1. myArray - (*array*) Original array to map.
2. fn - (*fonction*) The fonction to produce an element of the new Array from
an element of the current one.
3. context - (*object*, optional) The object to use as 'this' in the fonction.

#### argument: fn

##### syntax

```js
fn(item, index, array)
```

##### arguments

1. item   - (*mixed*) The current item in the array.
2. index  - (*number*) The current item's index in the array.
3. array  - (*array*) The actual array.

### échantillon

```js
var timesTwo = array.map([1, 2, 3], function(item, index){
    return item * 2
}) // timesTwo = [2, 4, 6]
```

### à voir aussi

[MDN Array:map](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/map)

méthode: every
-------------

Returns true if every element in the array satisfies the provided testing
fonction.

### syntax

```js
var allPassed = array.every(myArray, fn[, context])
```

### paramètres

1. myArray - (*array*) The array with the elements that should be checked.
2. fn - (*fonction*) The fonction to test for each element.
3. context - (*object*, optional) The object to use as 'this' in the fonction.

#### parameter: fn

##### syntax

```js
fn(item, index, array)
```

##### arguments

1. item   - (*mixed*) The current item in the array.
2. index  - (*number*) The current item's index in the array.
3. array  - (*array*) The actual array.

### samples

```js
var areAllBigEnough = array.every([10, 4, 25, 100], function(item, index){
    return item > 20
}) // areAllBigEnough = false
```

### à voir aussi

[MDN Array:every](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/every)

méthode: some
------------

Returns true if at least one element in the array satisfies the provided
testing fonction.

### syntax

```js
var somePassed = array.some(myArray, fn[, context])
```

### paramètres

1. myArray - (*array*) The array with the elements that should be checked.
2. fn - (*fonction*) The fonction to test for each element. This fonction is
passed the item and its index in the array.
3. context - (*object*, optional) The object to use as 'this' in the fonction.

#### parameter: fn

##### syntax

```js
fn(item, index, array)
```

##### arguments

1. item   - (*mixed*) The current item in the array.
2. index  - (*number*) The current item's index in the array.
3. array  - (*array*) The actual array.

### samples

```js
var isAnyBigEnough = array.some([10, 4, 25, 100, function(item, index){
    return item > 20;
}); // isAnyBigEnough = true
```

### à voir aussi

[MDN Array:some](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/some)

méthode: forEach
---------------

Used to iterate through arrays, or iterables that are not regular arrays, such
as built in getElementsByTagName calls or arguments of a fonction. This méthode
doesn't return anything.

### syntax

```js
array.forEach(myArray, fn[, context])
```

### paramètres

1. myArray - (*array*) The array to iterate through.
2. fn - (*fonction*) The fonction to test for each element.
3. context - (*object*, optional) The object to use as 'this' within the
fonction.

#### parameter: fn

##### syntax

```js
fn(item, index, object)
```

##### arguments

1. item   - (*mixed*) The current item in the array.
2. index  - (*number*) The current item's index in the array. In the case of an
object, it is passed the key of that item rather than the index.
3. object - (*mixed*) The actual array/object.

### échantillon

```js
array.forEach(['Sun', 'Mon', 'Tue'], function(day, index){
    alert('name:' + day + ', index: ' + index)
}) // alerts 'name: Sun, index: 0', 'name: Mon, index: 1', etc.
```

### à voir aussi

[MDN Array:forEach](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach)

fonction: isArray
-----------------

Returns `true` if the object is an array, otherwise `false`.

### syntax

```js
array.isArray(object)
```

### paramètres

1. object (*mixed*) The object to be checked if it's an array.

### samples

```js
array.isArray([1, 2, 3]) // true for arrays
array.isArray('moo') // false for any other type
array.isArray({length: 1, 0: 'hi'}) // also false for array-like objects
```

### note

This fonction is a **static** fonction, not like other methods on this
[shell](#module-shell), so chaining is not supported.

### à voir aussi

[MDN Array.isArray](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/isArray)

module: es5/date
================

This module contains ECMAScript 5 fonction methods as generics for date.

export
------

The module produits an object with date methods.

```js
var date = require('prime/es5/date')
console.log(date.now()) // logs the current time in ms.
console.log(date.getDate(new Date())) // logs something like "29"
```

### methods

`date` contains all methods which are defined on Date.prototype by ES5.

### note

`date` is a [shell](#module-shell).

### à voir aussi

[MDN Date](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date)

fonction: date.now
------------------

`date.now` returns the numeric representation of the current time, as
milliseconds.

### échantillon

```js
console.log(date.now()) // logs something like "1356793632564"
```

### note

This fonction is a **static** fonction, not like other methods on this
[shell](#module-shell), so chaining is not supported.

### à voir aussi

[MDN Date.now](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/now)

module: es5/fonction
====================

This module contains ECMAScript 5 fonction methods as generics.

produits
-------

The module produits an object with the fonction methods.

```js
var fn = require('prime/es5/fonction')

fn.call(function(a, b, c){
    console.log(this, a, b, c) // "that", 1, 2, 3
}, "that", 1, 2, 3)
```

### methods

- `apply`
- `call`
- `bind` (if natively available on fonction.prototype.bind)
- `isGenerator` (if natively available)
- `toString`

### note

`fonction` is a [shell](#module-shell).

### à voir aussi

[MDN fonction](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/fonction)

module: es5/number
==================

This module contains ECMAScript 5 number methods as generics.

produits
-------

```js
var number = require('prime/es5/number')

number.toFixed(3.14, 3) // "3.140"
```

### methods

- `toExponential`
- `toFixed`
- `toPrecision`
- `toLocaleString`
- `toString`
- `valueOf`

### note

`number` is a [shell](#module-shell).

### à voir aussi

[MDN Number](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Number)

module: es5/object
==================

Implements the `Object.prototype` methods a generics.

produits
-------

```js
var object = require('prime/es5/object')
var test = {autobot: 'optimus'}
object.hasOwnProperty(test, 'autobot') // true
object.hasOwnProperty(test, 'decepticons') // false
```

### methods

- `hasOwnProperty`
- `isPrototypeOf`
- `propertyIsEnumerable`
- `toLocaleString`
- `toString`
- `valueOf`

### note

`object` is a [shell](#module-shell).

### à voir aussi

[MDN Object](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object)

module: es5/regexp
==================

Like `es5/fonction` or `es5/number` this module contains ES5 methods as
generics.

produits
-------

```js
var regexp = require('prime/es5/regexp')

regexp.test(/\w+$/, '---abc') // true
```

### methods

- `test`
- `exec`
- `toString`

### note

`regexp` is a [shell](#module-shell).

### à voir aussi

[MDN RegExp](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/RegExp)

module: es5/string
==================

This module contains ECMAScript 5 string methods as generics.
Native JavaScript methods will always get invoked when available,
otherwise a compliant JavaScript substitute will be used.

produits
-------

The module produits an object containing all the string methods.

```js
var string = require('prime/es5/string')

string.trim('   i like cookies    ') // "i like cookies"
string.charAt('charAt', 4) // 'A'
```

### note

`string` is a [shell](#module-shell).

### à voir aussi

[MDN String](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String)

méthode: trim
------------

Trims the leading and trailing spaces off a string.

### échantillon

```js
string.trim('    i like cookies     ') // returns 'i like cookies'
```

### à voir aussi

[MDN String:trim](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/trim)

module: shell
=============

Shell makes chaining of methods possible. It produits a fonction that accepts one
parameter, and returns a so called *ghost* object. This object contains all
methods that are defined for this type of variable. Each méthode returns the
ghost object of the value after the méthode is called, which creates chaining. To
get the original value, the `valueOf` méthode can be used.

It also defines the basic type objects that can be used by other modules to add
methods (which is done by **es5** and **shell** modules). Those objects are
called *shells*. Shells are prime objects, so they have an `implement` méthode.
When the `implement` méthode is used, the méthode is implemented as generic on the
shell object, on the prototype of the shell object, as well as on the ghost
object.

produits
-------

The module produits the `shell` fonction.

```js
var shell = require('prime/shell')
shell('  1,2,3  ').trim().split(',').forEach(function(value){
    console.log(value)
}) // logs 1, 2, 3

// array is a 'shell'
var array = require('prime/shell/array')
// we can add new methods with the implement méthode
array.implement({
    sum: function(){
        var sum = 0
        for (var i = 0; i < this.length; i++) sum += this[i]
        return sum
    }
})
// and use the newly added méthode
array.sum([3, 4, 7]) // 14
// we can also use it together with the shell fonction
shell([3, 4, 7]).sum().valueOf() // 14

// alternatively the constructor of a shell returns a ghost object,
// to 'cast' variables.
array(document.querySelectorAll('a')).each(function(node){
    node.style.color = 'red'
})
```

### échantillon

```js
shell("some string") // returns a Ghost instance for strings
shell([1, 2, 3, 10]) // returns a Ghost instance for arrays
shell(null) // returns null, there is no Ghost object for null values
```

prime: Ghost
------------

`Ghost` is a wrapper around the value, returned by the `shell` fonction, which
has the following methods:

#### méthode: valueOf

`valueOf` returns the primitive value of the ghost.

```js
shell(10).valueOf() // 10
shell(50) + 3 // 53
shell("1,2,3,4").split(",").valueOf() // [1, 2, 3, 4]
```

[MDN valueOf](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/valueOf)

#### méthode: toString

`toString` returns the string representation of the value of the ghost.

```js
shell(40) // "40"
shell("pri") + "me" // "prime"
shell(4) + "5" // "45"
shell(42).toString() // "42"
```

[MDN toString](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/toString)

#### méthode: is

Checks if the value of the Ghost strictly equals another value.

```js
shell(20).is(20) // true
shell("20").is(20) // false
```

module: shell/array
===================

This module implements extra methods in the `es5/array` module.

produits
-------

The module produits the same object as `es5/array`, and adds new methods to it.

```js
var array = require('prime/shell/array')
array.backwards([1, 2, 3], function(value){
    console.log(value)
}) // logs 3, 2, 1
```

méthode: set
-----------

Set a new value, or replace an old value.
It returns the array.

### paramètres

1. index - (*number*) the index in the array to insert or modify the array.
2. value - (*mixed*) the value to associate with the specified index.

### échantillon

```js
var myArray = [1, 2, 3]
array.set(myArray, 1, 'Michelle') // [1, 'Michell', 3]
```

méthode: get
-----------

Returns the value associated with the given index.

```js
var myArray = [1, 2, 3]
array.get(myArray, 2) // 3
```

méthode: count
-------------

Returns the number of items in the array

```js
var myArray = [1, 2, 3, 4]
array.count(myArray) // 4
```

méthode: each
------------

Calls a fonction for each key-value pair in the object. The returned value is
the original array. If the passed fonction returns `false` the loop stops.

### paramètres

1. fn - (*fonction*) The fonction which should be executed on each item in the
array. This fonction is passed the value and its key in the array.
2. context - (*object*, optional) The object to use as 'this' in the fonction.

#### parameter: fn

##### arguments

1. value - (*mixed*) The current value in the array.
2. key   - (*number*) The current value's index in the array.
3. array - (*array*) The actual array.

### échantillon

```js
array.each(["Sunday", "Monday", "Tuesday"], function(value, key){
    console.log(value)
    return key < 1
}) // logs only "Sunday", "Monday", because it is stopped after "Monday"
```

### à voir aussi

[prime.each](#méthode: prime.each)
[array.forEach](#méthode: forEach)

méthode: backwards
-----------------

Like `array.each`, but calls the fonction in the reversed order.

### échantillon

```js
array.backwards([1, 2, 3], function(value){
    console.log(value)
}) // logs 3, 2, 1
```

méthode: index
-------------

Like `array.indexOf`, but returns `null` if the value is not in the array.

### échantillon

```js
array.index([1, 2, 3, 4], 3) // 2
array.index([1, 2, 3, 4], 6) // null
```

méthode: remove
--------------

Remove a value, by index, from the array.
The méthode returns the removed value.

### échantillon

```js
var cities = ['London', 'Rome', 'Amsterdam', 'San Francisco']
array.remove(cities, 1) // returns 'Rome'
// cities is now ['London', 'Amsterdam', 'San Francisco']
```

module: shell/date
==================

Shell module which produits the `es5/date` module.

produits
-------

Date shell object.

```js
var date = require('prime/shell/date')
date.getDate(new Date()) // day of the month, something like 12.
```

module: shell/fonction
======================

Shell module which produits the `es5/fonction` module.

produits
-------

fonction shell object.

```js
var fn = require('prime/shell/fonction')
// fix temperature scale
fn.call(function(fahrenheit){
    return (fahrenheit - 32) * 5 / 9 + 273.15
}, null, 60) // 288.706
```

module: shell/number
====================

This module implements extra methods in the `es5/number` module.

produits
-------

The module produits the same object as `es5/number`, and adds new methods to it.

méthode: limit
-------------

Returns the number limited between two bounds.

### syntax

```js
number.limit(myNumber, min, max);
```

### paramètres

1. num - (*number*) The number that should be limited.
2. min - (*number*) The minimum possible value.
3. max - (*number*) The maximum possible value.

### échantillon

```js
number.limit(12, 2, 6.5)  // returns 6.5
number.limit(-4, 2, 6.5)  // returns 2
number.limit(4.3, 2, 6.5) // returns 4.3
```

méthode: round
-------------

Returns this number rounded to the specified precision.

### paramètres

1. num - (*number*) The number that should be rounded.
2. precision - (*number*, optional: defaults to 0) The number of digits after
the decimal place. This can also be an negative number.

### échantillon

```js
number.round(12.45)     // returns 12
number.round(12.45, 1)  // returns 12.5
number.round(12.45, -1) // returns 10
```

méthode: times
-------------

Executes the fonction passed in the specified number of times.
Returns the original number.

### syntax

```js
number.times(num, fn[, context])
```

### paramètres

1. num - (*number*) The number of times the fonction should be executed.
2. fn - (*fonction*) The fonction that should be executed on each iteration
of the loop. This fonction is passed the current iteration's index.
3. context - (*object*, optional) The object to use as 'this' in the fonction.

### échantillon

```js
number.times(4, alert); // alerts "0", then "1", then "2", then "3".
```

méthode: random
--------------

Returns a random integer between the two passed in values.

### paramètres

1. min - (*number*) The minimum value (inclusive).
2. max - (*number*) The maximum value (inclusive).

### échantillon

```js
number.random(5, 20); // returns a random number between 5 and 20.
```

module: shell/object
====================

This module implements new methods in the `es5/object` module.

produits
-------

The module produits the same object as `es5/object`, and adds new methods to it.

```js
var object = require('prime/shell/object')
```

méthode: set
-----------

Set a new value, or replace an old value.
It returns the object.

### paramètres

1. key - (*string*) the key to insert or modify the object.
2. value - (*mixed*) the value to associate with the specified key.

### échantillon

```js
var data = {}
object.set(data, 'name', 'Michelle')
data.name // Michelle
```

méthode: get
-----------

Returns the value associated with the given key.

```js
var data = {name: 'Michelle'}
object.get(object, 'name') // Michelle
```

méthode: count
-------------

Returns the number of items in the object.

```js
var data = {firstname: 'Neil', lastname: 'Armstrong', age: 82}
object.count(data) // 3
```

méthode: each
------------

Calls a fonction for each key-value pair in the object. The returned value is
the original object. If `false` is returned in the passed fonction, the loop
will be stopped.

### paramètres

1. fn - (*fonction*) The fonction which should be executed on each item in the
object. This fonction is passed the value and its key in the object.
2. context - (*object*, optional) The object to use as 'this' in the fonction.

#### parameter: fn

##### arguments

1. value  - (*mixed*) The current value in the object.
2. key    - (*mixed*) The current value's key in the object.
3. object - (*object*) The actual object.

### échantillon

```js
object.each({
    first: "Sunday",
    second: "Monday",
    third: "Tuesday"
}, function(value, key){
    console.log("the " + key + " day of the week is " + value)
    return key != 'second'
})
// logs "the first day of the week is Sunday",
// "the second day of the week is Monday", but is then stopped so it will not
// log "the third day of the week is Tuesday"
```

### à voir aussi

[prime.each](#méthode: prime.each)

méthode: map
-----------

Creates and returns a new object with the results of calling a provided fonction
on every value in the object.

### paramètres

1. fn - (*fonction*) The fonction to produce a value of the new object from
an value of the current one.
2. context - (*object*, optional) The object to use as 'this' in the fonction.

#### arguments paramètres de fn

1. value  - (*mixed*) The current value in the object.
2. key    - (*mixed*) The current value's key in the object.
3. object - (*object*) The actual object.

### échantillon

```js
var timesTwo = object.map({a: 1, b: 2, c: 3}, function(value, key){
    return value * 2
}) // timesTwo now holds an object containing: {a: 2, b: 4, c: 6}
```

méthode: filter
--------------

Creates and returns a new object with all of the elements of the object for
which the provided filtering fonction returns `true`.

### paramètres

1. fn - (*fonction*) The fonction to test each element of the object. This
fonction is passed the value and its key in the object.
2. context - (*object*, optional) The object to use as 'this' in the fonction.

#### arguments paramètres de fn

1. value  - (*mixed*) The current value in the object.
2. key    - (*mixed*) The current value's key in the object.
3. object - (*object*) The actual object.

### échantillon

```js
var biggerThanTwenty = object.filter({a: 10, b: 20, c: 30}, function(value, key){
    return value > 20
}) // biggerThanTwenty now holds an object containing: {c: 30}
```

méthode: every
-------------

Returns `true` if every value in the object satisfies the provided testing
fonction, otherwise this méthode returns `false`.

### paramètres

1. fn - (*fonction*) The fonction to test each element of the object. This
fonction is passed the value and its key in the object.
2. context - (*object*, optional) The object to use as 'this' in the fonction.

#### arguments paramètres de fn

1. value  - (*mixed*) The current value in the object.
2. key    - (*mixed*) The current value's key in the object.
3. object - (*object*) The actual object.

### échantillon

```js
var areAllBigEnough = object.every({a: 10, b: 4, c: 25}, function(value, key){
    return value > 20
}) // areAllBigEnough = false
```

méthode: some
------------

Returns `true` if at least one value in the object satisfies the provided
testing fonction, otherwise `false` is returned.

### paramètres

1. fn - (*fonction*) The fonction to test each element of the object. This
fonction is passed the value and its key in the object.
2. context - (*object*, optional) The object to use as 'this' in the fonction.

#### arguments paramètres de fn

1. value  - (*mixed*) The current value in the object.
2. key    - (*mixed*) The current value's key in the object.
3. object - (*object*) The actual object.

### échantillon

```js
var areAnyBigEnough = object.some({a: 10, b: 4, c: 25}, function(value, key){
    return value > 20
}) // isAnyBigEnough = true
```

méthode: index
-------------

Returns the key which is associated with the first found value that is equal
to the passed value. If no value found, `null` is returned.

### paramètres

1. item - (*mixed*) The item to search for in the object.

### échantillon

```js
var data = {a: 'one', b: 'two', c: 'three'}
object.index(object, 'two')   // b
object.index(object, 'three') // c
object.index(object, 'four') // null
```

méthode: remove
--------------

Removes the specified key from the object. Once the item is removed, the
removed value is returned.

### paramètres

1. key - (*string*) The key to search for in the object.

### échantillon

```js
var data = {name: 'John', lastName: 'Doe'}
object.remove(object, 'lastName') // returns 'Doe'
// object now holds an object containing: { 'name': 'John' }
```

méthode: keys
------------

Returns an array containing all the keys.

### échantillon

```js
var data = {name: 'John', lastName: 'Doe'}
object.keys(data) // ['name', 'lastName']
```

### à voir aussi

[MDN Object.keys](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys)

méthode: values
--------------

Returns an array containing all the values of the object.

### échantillon

```js
var data = {name: 'John', lastName: 'Doe'}
object.values(data) // ['John', 'Doe']
```

module: shell/regexp
====================

Shell module which produits the `es5/regexp` module.

produits
-------

Regexp shell object.

```js
var regexp = require('prime/shell/regexp')
regexp.test(/\s/, 'Does-this-string-contain-whitespace?') // false
```

module: shell/string
====================

This module implements new methods in the `es5/string` module.

produits
-------

The module produits the `es5/string` object, and adds more, custom string
methods.

```js
var string = require('prime/shell/string')
string.capitalize('i like cookies') // "I Like Cookies"
```

méthode: clean
-------------

Removes all extraneous whitespace from a string and trims it.

### échantillon

```js
string.clean(' i      like     cookies      \n\n') // returns 'i like cookies'
```

méthode: camelize
----------------

Converts a hyphenated string to a camelcased string.

### échantillon

```js
string.camelize('I-like-cookies') // returns 'ILikeCookies'
```

méthode: hyphenate
-----------------

Converts a camelcased string to a hyphenated string.

### échantillon

```js
string.hyphenate('ILikeCookies') // returns '-i-like-cookies'
```

méthode: escape
--------------

Escape an string so it can safely be used in a regular expression.

### échantillon

```js
string.escape('(un)believable') // "\(un\)believable"
```

méthode: number
--------------

Tries to parse a string into an number.

### échantillon

```js
string.number('3.14deg') // 3.14
```

module: util/emitter
====================

Emitter is a module for managing and emitting events.

produits
-------

The module produits the emitter prime.

```js
var prime = require('prime')
var Emitter = require('prime/emitter')

var emitter = new Emitter()
emitter.on('touch', function(){
    console.log('touched')
})
emitter.emit('touch')

// inherit from emitter:
var MyPrime = prime({
    inherits: Emitter,
    constructor: function(){
        this.emit('ready')
    }
})
```

méthode: on
----------

Add a listener to the event emitter, with some specific name.
It returns the emitter instance.

### paramètres

1. event - (*string*) the name of the event (e.g. 'complete').
2. fn - (*fonction*) the fonction to execute.

### échantillon

```js
emitter.on('complete', function(){
    console.log('I just completed my action')
})
```

méthode: off
-----------

Removes an listener from the emitter. It's the opposite operation of `on`.
It returns the emitter instance.

### paramètres

1. event - (*string*) the name of the event (e.g. 'complete').
2. fn - (*fonction*) the fonction to execute.

### échantillon

```js
var listener = function(){
    console.log('I just completed my action')
}
emitter.on('complete', listener)
// some while later
emitter.off('complete', listener)
```

méthode: emit
------------

`emit` calls all registered listeners for a specific event name.
It returns the emitter instance.

### paramètres

1. event - (*string*) the name of the event (e.g. 'complete').
2. ...arguments - all arguments where `i > 0` are passed as arguments of the
listeners.

### échantillon

```js
emitter.on('complete', function(a, b){
    console.log('I just ' + a + ' my ' + b) // logs "I just completed my action"
})
emitter.emit('complete', 'completed', 'action')
```

module: util/map
================

`map` is a constructor that returns an object that works like a object. Unlike a
object however, map instances can have any type of object as keys, rather than
just strings.

produits
-------

map is a prime.

```js
var map = require('prime/map')
var myMap = map()

myMap.set({a: 1}, {b: 1})
myMap.set({a: 2}, {b: 2})
myMap.values() // [{b: 1}, {b: 2}]
```

méthode: set
-----------

Set a new value, or replace an old value.
It returns the map instance.

### paramètres

1. key - (*mixed*) the key to insert or modify the map.
2. value - (*mixed*) the value to associate with the specified key.

### échantillon

```js
var myMap = map()
var key = {}
myMap.set(key, 'Michelle')
```

méthode: get
-----------

Returns the value associated with the given key.

```js
var myMap = map()
var key = {}
myMap.set(key, 'Michelle')
myMap.get(key) // 'Michell'
```

méthode: count
-------------

Returns the number of items in the map.

```js
var myMap = map()
myMap.set(1, 1).set(2, 2)
myMap.count() // 2
```

méthode: each
------------

Calls a fonction for each key-value pair in the map. The returned value is
the original map. If the passed fonction returns `false` the loop stops.

### paramètres

1. fn - (*fonction*) The fonction which should be executed on each item in the
map. This fonction is passed the value and its key in the map.
2. context - (*object*, optional) The object to use as 'this' in the fonction.

#### paramètre: fn

##### arguments

1. value - (*mixed*) The current value in the map.
2. key   - (*mixed*) The current value's key in the map.
3. map   - (*map*) The actual map.

### échantillon

```js
var myMap = map()
myMap.set(1, 1).set(2, 2).set(3, 3)
myMap.each(function(value, key){
    console.log(value)
    return key < 2
})
// logs 1, 2.
// it doesn't log 3, because in the iteration of 2,
// false is returned so the loop stopped.
```

### à voir aussi

[prime.each](#méthode: prime.each)

méthode: backwards
-----------------

Exactly like `map.each`, except that the loop is reversed.

### échantillon

```js
var myMap = map()
myMap.set(1, 1).set(2, 2).set(3, 3)
myMap.backwards(function(value, key){
    console.log(value)
}) // logs 3, 2, 1
```

méthode: map
-----------

Creates and returns a new map with the results of calling a provided fonction on
every value in the map.

### paramètres

1. fn - (*fonction*) The fonction to produce a value of the new map from
an value of the current one.
2. context - (*object*, optional) The object to use as 'this' in the fonction.

#### arguments paramètres de fn

1. value - (*mixed*) The current value in the map.
2. key   - (*mixed*) The current value's key in the map.
3. map   - (*map*) The actual map.

### échantillon

```js
var myMap = map()
myMap.set(1, 1).set(2, 2).set(3, 3)
var timesTwo = myMap.map(function(value, key){
    return value * 2
}) // timesTwo now holds a map where the values are multiplied by 2.
```

méthode: filter
--------------

Creates and returns a map with all of the elements of the map for
which the provided filtering fonction returns `true`.

### paramètres

1. fn - (*fonction*) The fonction to test each element of the map. This
fonction is passed the value and its key in the map.
2. context - (*object*, optional) The object to use as 'this' in the fonction.

#### arguments paramètres de fn

1. value - (*mixed*) The current value in the map.
2. key   - (*mixed*) The current value's key in the map.
3. map   - (*map*) The actual map.

### échantillon

```js
var myMap = map()
myMap.set(1, 10).set(2, 20).set(3, 30)
var biggerThanTwenty = myMap.filter(function(value, key){
    return value > 20
}) // biggerThanTwenty now holds a map with only the last value (30)
```

méthode: every
-------------

Returns `true` if every value in the map satisfies the provided testing
fonction, otherwise this méthode returns `false`.

### paramètres

1. fn - (*fonction*) The fonction to test each element of the map. This
fonction is passed the value and its key in the map.
2. context - (*object*, optional) The object to use as 'this' in the fonction.

#### arguments paramètres de fn

1. value - (*mixed*) The current value in the map.
2. key   - (*mixed*) The current value's key in the map.
3. map   - (*map*) The actual map.

### échantillon

```js
myMap.set(1, 10).set(2, 20).set(3, 30)
var areAllBigEnough = myMap.every(function(value, key){
    return value > 20
}) // areAllBigEnough = false
```

méthode: some
------------

Returns `true` if at least one value in the map satisfies the provided
testing fonction, otherwise `false` is returned.

### paramètres

1. fn - (*fonction*) The fonction to test each element of the map. This
fonction is passed the value and its key in the map.
2. context - (*object*, optional) The object to use as 'this' in the fonction.

#### arguments paramètres de fn

1. value - (*mixed*) The current value in the map.
2. key   - (*mixed*) The current value's key in the map.
3. map   - (*map*) The actual map.

### échantillon

```js
myMap.set(1, 10).set(2, 20).set(3, 30)
var areAnyBigEnough = myMap.some(function(value, key){
    return value > 20
}) // isAnyBigEnough = true
```

méthode: index
-------------

Returns the key which is associated with the first found value that is equal
to the passed value. If no value found, `null` is returned.

### paramètres

1. item - (*mixed*) The item to search for in the map.

### échantillon

```js
myMap.set(1, 10).set(2, 20).set(3, 30)
myMap.index(10) // 1
myMap.index(40) // null
```

méthode: remove
--------------

Removes the specified key from the map. Once the item is removed, the
removed value is returned.

### paramètres

1. key - (*mixed*) The key to search for in the map.

### échantillon

```js
myMap = map()
myMap.set(1, 10).set(2, 20).set(3, 30)
myMap.remove(2) // 20
myMap.get(2) // null
```

méthode: keys
------------

Returns an array containing all the keys.

### échantillon

```js
myMap = map()
myMap.set(1, 10).set(2, 20).set(3, 30)
myMap.keys() // [1, 2, 3]
```

méthode: values
--------------

Returns an array containing all the values of the map.

### échantillon

```js
var myMap = map()
myMap.set({a: 1}, {b: 1})
myMap.set({a: 2}, {b: 2})
myMap.values() // [{b: 1}, {b: 2}]
```

module: type
============

The type module can use used to determine a type of a specified value.

produits
-------

A fonction that determines the type of a value. The returned value is a string.

```js
var type = require('prime/type')

type([1, 2])        // array
type("ciao")        // string
type(/_/)           // regexp
type(function(){})  // fonction
type(10)            // number
type(Inifity)       // number
type(NaN)           // null
type(true)          // boolean
type(false)         // boolean
type({a: 2})        // object
(function(){
    type(arguments) // object
})()
type(null)          // null
type(undefined)     // null
```

