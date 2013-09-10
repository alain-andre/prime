Package: prime
==============

 1. fondamental, basic, essentiel.
 2. façonne (quelque chose) à l'utilisation ou à l'action.
 3. archétypal, prototypique, typique, classique.

**Prime** est un assistant à l'héritage prototypique.

Module: prime
-------------

### Produits

Le module prime fournit une fonction qui peut créer de nouveaux _primes_.
La fonction retourne une méthode `constructor`, complétée par
la méthode `implements`.

### Paramètres

1. properties - (*object*) Un objet qui contient les propriétés et méthodes
qui seront appliquées sur le constructeur.

### Propriété: constructor

Lorsqu'une methode est passée avec la clé `constructor`, elle va devenir votre prime.
Toutes les propriétés suivantes (sauf particulières) s'appliqueront sur ce constructeur comme des prototypes.

### Propriété: inherits

Lorsqu'un objet est passé avec la clé `inherits` en tant que propriété, votre construteur va 
hériter des prototypes passés par cet objet.

### Échantillon

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

Méthode: prime:implement
-----------------------
Le constructeur retourné par `prime()` est étendu avec une méthode `implement`.
Il implémente de nouvelles méthodes sur le prototype du constructeur.
La fonction retourne le constructeur.

### Syntaxe

```js
MyPrime.implement(methods)
```

### Paramètres

1. methods - (*object*) Un objet avec des clés:valeurs qui représentent des noms de prototype et
leurs méthodes.

### Échantillon

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

### Syntaxe

```js
prime.each(object, fonction)
```

### Paramètres

1. object - (*object*) L'objet à itérer.
2. fonction - (*fonction*) La fonction appelée pour chaque propriété.
3. context - (*object*) La condition passée à la fonction.

### Échantillon

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

### Paramètres

1. object - (*object*) L'objet.
2. property - (*string*) Le nom de la propriété à rechercher.

### Échantillon

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

### À voir aussi

[MDN Object.hasOwnProperty](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/hasOwnProperty)

fonction: prime.create
----------------------

Crée une nouvelle instance d'un constructeur vide, dont le prototype prend la valeur de l'objet 
passé. Ceci est principalement utilisé pour l'héritage, pour instancier un prime
sans avoir à invoquer son constructeur. Il utilise l'`Object.create` natif
le cas échéant. Sauf si vous avez une raison très particulière d'utiliser ceci, vous devriez
Utilisez `prime` au lieu de cela et sa meta-méthode `inherits`.

### Syntaxe

```js
prime.create(proto)
```

### Paramètres

- proto - (*object*) Le prototype du constructeur vide instancié.
Retourne l'object créé.

### Retours

- (*object*) Une instance du constructeur vide.

### Échantillon

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

### À voir aussi

[MDN Object.create](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create)

fonction: prime.define
----------------------

Définit une propriété sur un objet et le retourne.
Le descripteur devrait au moins avoir la propriété `value`. Les autres propriétés de descripteur
sont uniquement prises en charge dans les environnements compatibles ES5.

### Échantillon

```js
var object = {}
prime.define(object, 'number', {
    value: 1,
    enumerable: false
})

console.log(object.number) // 1
```

### Paramètres

1. object (*object*) L'objet sur lequel définir la propriété.
2. key (*string*) Le nom de la propriété.
3. descriptor (*object*) Un descripteur de propriété pour la propriété en cours de définition.

### À voir aussi

[MDN Object.defineProperty](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty)

Module: es5/array
=================

Ce module contient les méthodes ECMAScript 5 array de façon générique.
Les méthodes natives de JavaScript seront toujours appellées si disponibles, 
sinon un substitut JavaScript sera utilisé.

produits
-------

Le module produit un objet contenant toutes les méthodes _array_.

```js
var array = require('prime/es5/array')
array.indexOf([1, 2, 3], 2) // 1
```

Toutes les méthodes ES3 Array sont aussi ajoutées de façon génériques :

```js
(function(){
    var args = array.slice(arguments) // [1, 2, 3]
    array.push(args, 4) // [1, 2, 3, 4]
})(1, 2, 3)
```

### Note

`array` est un [shell](#module-shell).

Méthode: filter
--------------

Retourne un nouvel _array_ avec les éléments de l'_array_ original pour 
lequel la fonction de filtrage fourni retourne `true`.

### Syntaxe

```js
var filteredArray = array.filter(myArray, fn[, context])
```

### Paramètres

1. myArray - (*array*) L' _array_ à filtrer.
1. fn - (*fonction*) La fonction pour tester chaque élément de l'_array_. 
Cette fonction est passée avec l'élément et son index dans l'_array_.
2. context - (*object*, optionnel) L'objet à utiliser tel que dans la fonction.

#### Paramètre: fn

##### Syntaxe

```js
fn(item, index, array)
```

##### Arguments

1. item   - (*mixed*) L'élément en cours dans l'_array_.
2. index  - (*number*) L'index de l'élément en cours dans l'_array_.
3. array  - (*array*) L'_array_ actuel.

### Échantillon

```js
var biggerThanTwenty = array.filter([10, 3, 25, 100], function(item, index){
    return item > 20
}) // biggerThanTwenty = [25, 100]
```

### À voir aussi:

[MDN Array:filter](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/filter)

Méthode: indexOf
---------------

Retourne l'index du premier élément dans l'_array_ qui correspond à la valeur spécifiée,
ou -1 si la valeur n'est pas trouvée.

### Paramètres

1. item - (*object*) L'élément à rechercher dans l'_array_.
2. from - (*number*, optionnel: à 0 par défaut) L'index à partir duquel rechercher dans l'_array_.

### Échantillons

```js
array.indexOf(['apple', 'lemon', 'banana'], 'lemon') // retourne 1
array.indexOf(['apple', 'lemon'], 'banana'); // retourne -1
```

### À voir aussi

[MDN Array:indexOf](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf)

Méthode: map
-----------

Crée et retourne un nouvel _array_ avec les résultats de l'appel à une fonction 
fournie sur chaqun des éléments de l'_array_.

### Syntaxe

```js
var mappedArray = array.map(myArray, fn[, context])
```

### Paramètres

1. myArray - (*array*) L'_array_ original à mapper.
2. fn - (*fonction*) La fonction à appliquer sur l'élément de l'_array_ produisant le nouvel élément.
3. context - (*object*, optionnel) L'objet à utiliser tel que dans la fonction.

#### Argument: fn

##### Syntaxe

```js
fn(item, index, array)
```

##### Arguments

1. item   - (*mixed*) L'élement en cours dans l'_array_.
2. index  - (*number*) L'index de l'élément n cours dans l'_array_.
3. array  - (*array*) L'_array_ actuel.

### Échantillon

```js
var timesTwo = array.map([1, 2, 3], function(item, index){
    return item * 2
}) // timesTwo = [2, 4, 6]
```

### À voir aussi

[MDN Array:map](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/map)

Méthode: every
-------------

Retourne `true` si chaque élément de l'_array_ satisfait la fonction de test fournie.

### Syntaxe

```js
var allPassed = array.every(myArray, fn[, context])
```

### Paramètres

1. myArray - (*array*) L' _array_ avec les éléments qui doivent être contôlés.
2. fn - (*fonction*) La fonction pour tester chaque élément.
3. context - (*object*, optional) L'objet à utiliser 'tel que' dans la fonction.

#### Paramètre: fn

##### Syntaxe

```js
fn(item, index, array)
```

##### Arguments

1. item   - (*mixed*) L'objet courant dans l'_array_.
2. index  - (*number*) L'index de l'objet courant dans l'_array_.
3. array  - (*array*) L'_array_ actuel.

### Échantillons

```js
var areAllBigEnough = array.every([10, 4, 25, 100], function(item, index){
    return item > 20
}) // areAllBigEnough = false
```

### À voir aussi

[MDN Array:every](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/every)

Méthode: some
------------

Retourne `true` si au moins un élément valide la fonction passée.

### Syntaxe

```js
var somePassed = array.some(myArray, fn[, context])
```

### Paramètres

1. myArray - (*array*) L' _array_ avec les éléments qui doivent être contrôlés.
2. fn - (*fonction*) La fonction pour tester chaque élément. Cette fonction est passée de 
l'élément et son index dans l' _array_.
3. context - (*object*, optional) L'objet à utiliser 'tel que' dans la fonction.

#### Paramètre: fn

##### Syntaxe

```js
fn(item, index, array)
```

##### Arguments

1. item   - (*mixed*) L'objet courant dans l'_array_.
2. index  - (*number*) L'index de l'objet courant dans l'_array_.
3. array  - (*array*) L'_array_ actuel.

### Échantillons

```js
var isAnyBigEnough = array.some([10, 4, 25, 100, function(item, index){
    return item > 20;
}); // isAnyBigEnough = true
```

### À voir aussi

[MDN Array:some](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/some)

Méthode: forEach
---------------

Utilisé pour itérer à travers des _arrays_, ou des objets itérable qui ne sont pas des _arrays_, tel
que construit dans l'appel à `getElementsByTagName` ou des arguments de fonction. Cette méthode ne 
retourne rien.

### Syntaxe

```js
array.forEach(myArray, fn[, context])
```

### Paramètres

1. myArray - (*array*) L'_array à travers lequel itérer.
2. fn - (*fonction*) La fonction à tester pour chaque élément.
3. context - (*object*, optional) L'objet à utiliser 'tel quel' dans la
fonction.

#### Paramètre: fn

##### Syntaxe

```js
fn(item, index, object)
```

##### Arguments

1. item   - (*mixed*) L'objet courant dans l'_array_.
2. index  - (*number*) L'index de l'objet courant dans l'_array_. Dans le cas d'un objet,
La clé est passée plutôt que l'index.
3. object - (*mixed*) L'_array_/objet actuel.

### Échantillon

```js
array.forEach(['Sun', 'Mon', 'Tue'], function(day, index){
    alert('name:' + day + ', index: ' + index)
}) // alerts 'name: Sun, index: 0', 'name: Mon, index: 1', etc.
```

### À voir aussi

[MDN Array:forEach](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach)

fonction: isArray
-----------------

Retourne `true` si l'objet est un _array_, sinon `false`.

### Syntaxe

```js
array.isArray(object)
```

### Paramètres

1. object (*mixed*) L'objet à contrôler s'il s'agit d'un _array_.

### Échantillons

```js
array.isArray([1, 2, 3]) // Vrai pour les _arrays_
array.isArray('moo') // Faux pour tout autre type
array.isArray({length: 1, 0: 'hi'}) // Aussi faux pour tout les objets comme un _array_
```

### Note

Cette fonction est une fonction **static**, différente de celle dans ce 
[shell](#module-shell), donc le chainage n'est pas supporté.

### À voir aussi

[MDN Array.isArray](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/isArray)

Module: es5/date
================

Ce module contient les méthodes génériques de ECMAScript 5 pour les dates

export
------

Le module produit un objet avec des méthodes pour les dates.

```js
var date = require('prime/es5/date')
console.log(date.now()) // Affiche l'heure en cours en ms.
console.log(date.getDate(new Date())) // Affiche quelque chose comme "29"
```

### Méthodes

`date` contient toutes les méthodes définies dans Date.prototype de ES5.

### Note

`date` is a [shell](#module-shell).

### À voir aussi

[MDN Date](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date)

fonction: date.now
------------------

`date.now` retourne la représentation numérique de l'heure en cours, en
millisecondes.

### Échantillon

```js
console.log(date.now()) // Affiche quelque chose comme "1356793632564"
```

### Note

Cette fonction est une fonction **static**, elle n'est pas comme les autres méthodes de ce
[shell](#module-shell), donc le chaînage n'est pas suproté.

### À voir aussi

[MDN Date.now](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date/now)

Module: es5/fonction
====================

Ce module contient les fonctions génériques d'ECMAScript 5.

Produits
-------

Le module produits un objet avec les méthodes de la fonction.

```js
var fn = require('prime/es5/fonction')

fn.call(function(a, b, c){
    console.log(this, a, b, c) // "that", 1, 2, 3
}, "that", 1, 2, 3)
```

### Méthodes

- `apply`
- `call`
- `bind` (if natively available on fonction.prototype.bind)
- `isGenerator` (if natively available)
- `toString`

### Note

`fonction` is a [shell](#module-shell).

### À voir aussi

[MDN fonction](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/fonction)

Module: es5/number
==================

Ce module contient les méthodes génériques d'ECMAScript 5

Produits
-------

```js
var number = require('prime/es5/number')

number.toFixed(3.14, 3) // "3.140"
```

### Méthodes

- `toExponential`
- `toFixed`
- `toPrecision`
- `toLocaleString`
- `toString`
- `valueOf`

### Note

`number` is a [shell](#module-shell).

### À voir aussi

[MDN Number](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Number)

Module: es5/object
==================

Implémente les méthodes `Object.prototype`

Produits
-------
TODO
```js
var object = require('prime/es5/object')
var test = {autobot: 'optimus'}
object.hasOwnProperty(test, 'autobot') // true
object.hasOwnProperty(test, 'decepticons') // false
```

### Méthodes

- `hasOwnProperty`
- `isPrototypeOf`
- `propertyIsEnumerable`
- `toLocaleString`
- `toString`
- `valueOf`

### Note

`object` is a [shell](#module-shell).

### À voir aussi

[MDN Object](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object)

Module: es5/regexp
==================

Like `es5/fonction` or `es5/number` this module contains ES5 methods as
generics.

produits
-------

```js
var regexp = require('prime/es5/regexp')

regexp.test(/\w+$/, '---abc') // true
```

### Méthodes

- `test`
- `exec`
- `toString`

### Note

`regexp` is a [shell](#module-shell).

### À voir aussi

[MDN RegExp](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/RegExp)

Module: es5/string
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

### Note

`string` is a [shell](#module-shell).

### À voir aussi

[MDN String](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String)

Méthode: trim
------------

Trims the leading and trailing spaces off a string.

### Échantillon

```js
string.trim('    i like cookies     ') // returns 'i like cookies'
```

### À voir aussi

[MDN String:trim](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/String/trim)

Module: shell
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

### Échantillon

```js
shell("some string") // returns a Ghost instance for strings
shell([1, 2, 3, 10]) // returns a Ghost instance for arrays
shell(null) // returns null, there is no Ghost object for null values
```

prime: Ghost
------------

`Ghost` is a wrapper around the value, returned by the `shell` fonction, which
has the following methods:

#### Méthode: valueOf

`valueOf` returns the primitive value of the ghost.

```js
shell(10).valueOf() // 10
shell(50) + 3 // 53
shell("1,2,3,4").split(",").valueOf() // [1, 2, 3, 4]
```

[MDN valueOf](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/valueOf)

#### Méthode: toString

`toString` returns the string representation of the value of the ghost.

```js
shell(40) // "40"
shell("pri") + "me" // "prime"
shell(4) + "5" // "45"
shell(42).toString() // "42"
```

[MDN toString](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/toString)

#### Méthode: is

Checks if the value of the Ghost strictly equals another value.

```js
shell(20).is(20) // true
shell("20").is(20) // false
```

Module: shell/array
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

Méthode: set
-----------

Set a new value, or replace an old value.
It returns the array.

### Paramètres

1. index - (*number*) the index in the array to insert or modify the array.
2. value - (*mixed*) the value to associate with the specified index.

### Échantillon

```js
var myArray = [1, 2, 3]
array.set(myArray, 1, 'Michelle') // [1, 'Michell', 3]
```

Méthode: get
-----------

Returns the value associated with the given index.

```js
var myArray = [1, 2, 3]
array.get(myArray, 2) // 3
```

Méthode: count
-------------

Returns the number of items in the array

```js
var myArray = [1, 2, 3, 4]
array.count(myArray) // 4
```

Méthode: each
------------

Calls a fonction for each key-value pair in the object. The returned value is
the original array. If the passed fonction returns `false` the loop stops.

### Paramètres

1. fn - (*fonction*) The fonction which should be executed on each item in the
array. This fonction is passed the value and its key in the array.
2. context - (*object*, optional) The object to use as 'this' in the fonction.

#### Paramètre: fn

##### Arguments

1. value - (*mixed*) The current value in the array.
2. key   - (*number*) The current value's index in the array.
3. array - (*array*) L'_array_ actuel.

### Échantillon

```js
array.each(["Sunday", "Monday", "Tuesday"], function(value, key){
    console.log(value)
    return key < 1
}) // logs only "Sunday", "Monday", because it is stopped after "Monday"
```

### À voir aussi

[prime.each](#Méthode: prime.each)
[array.forEach](#Méthode: forEach)

Méthode: backwards
-----------------

Like `array.each`, but calls the fonction in the reversed order.

### Échantillon

```js
array.backwards([1, 2, 3], function(value){
    console.log(value)
}) // logs 3, 2, 1
```

Méthode: index
-------------

Like `array.indexOf`, but returns `null` if the value is not in the array.

### Échantillon

```js
array.index([1, 2, 3, 4], 3) // 2
array.index([1, 2, 3, 4], 6) // null
```

Méthode: remove
--------------

Remove a value, by index, from the array.
The méthode returns the removed value.

### Échantillon

```js
var cities = ['London', 'Rome', 'Amsterdam', 'San Francisco']
array.remove(cities, 1) // returns 'Rome'
// cities is now ['London', 'Amsterdam', 'San Francisco']
```

Module: shell/date
==================

Shell module which produits the `es5/date` module.

produits
-------

Date shell object.

```js
var date = require('prime/shell/date')
date.getDate(new Date()) // day of the month, something like 12.
```

Module: shell/fonction
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

Module: shell/number
====================

This module implements extra methods in the `es5/number` module.

produits
-------

The module produits the same object as `es5/number`, and adds new methods to it.

Méthode: limit
-------------

Returns the number limited between two bounds.

### Syntaxe

```js
number.limit(myNumber, min, max);
```

### Paramètres

1. num - (*number*) The number that should be limited.
2. min - (*number*) The minimum possible value.
3. max - (*number*) The maximum possible value.

### Échantillon

```js
number.limit(12, 2, 6.5)  // returns 6.5
number.limit(-4, 2, 6.5)  // returns 2
number.limit(4.3, 2, 6.5) // returns 4.3
```

Méthode: round
-------------

Returns this number rounded to the specified precision.

### Paramètres

1. num - (*number*) The number that should be rounded.
2. precision - (*number*, optional: defaults to 0) The number of digits after
the decimal place. This can also be an negative number.

### Échantillon

```js
number.round(12.45)     // returns 12
number.round(12.45, 1)  // returns 12.5
number.round(12.45, -1) // returns 10
```

Méthode: times
-------------

Executes the fonction passed in the specified number of times.
Returns the original number.

### Syntaxe

```js
number.times(num, fn[, context])
```

### Paramètres

1. num - (*number*) The number of times the fonction should be executed.
2. fn - (*fonction*) The fonction that should be executed on each iteration
of the loop. This fonction is passed the current iteration's index.
3. context - (*object*, optional) The object to use as 'this' in the fonction.

### Échantillon

```js
number.times(4, alert); // alerts "0", then "1", then "2", then "3".
```

Méthode: random
--------------

Returns a random integer between the two passed in values.

### Paramètres

1. min - (*number*) The minimum value (inclusive).
2. max - (*number*) The maximum value (inclusive).

### Échantillon

```js
number.random(5, 20); // returns a random number between 5 and 20.
```

Module: shell/object
====================

This module implements new methods in the `es5/object` module.

produits
-------

The module produits the same object as `es5/object`, and adds new methods to it.

```js
var object = require('prime/shell/object')
```

Méthode: set
-----------

Set a new value, or replace an old value.
It returns the object.

### Paramètres

1. key - (*string*) the key to insert or modify the object.
2. value - (*mixed*) the value to associate with the specified key.

### Échantillon

```js
var data = {}
object.set(data, 'name', 'Michelle')
data.name // Michelle
```

Méthode: get
-----------

Returns the value associated with the given key.

```js
var data = {name: 'Michelle'}
object.get(object, 'name') // Michelle
```

Méthode: count
-------------

Returns the number of items in the object.

```js
var data = {firstname: 'Neil', lastname: 'Armstrong', age: 82}
object.count(data) // 3
```

Méthode: each
------------

Calls a fonction for each key-value pair in the object. The returned value is
the original object. If `false` is returned in the passed fonction, the loop
will be stopped.

### Paramètres

1. fn - (*fonction*) The fonction which should be executed on each item in the
object. This fonction is passed the value and its key in the object.
2. context - (*object*, optional) The object to use as 'this' in the fonction.

#### Paramètre: fn

##### Arguments

1. value  - (*mixed*) The current value in the object.
2. key    - (*mixed*) The current value's key in the object.
3. object - (*object*) The actual object.

### Échantillon

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

### À voir aussi

[prime.each](#Méthode: prime.each)

Méthode: map
-----------

Creates and returns a new object with the results of calling a provided fonction
on every value in the object.

### Paramètres

1. fn - (*fonction*) The fonction to produce a value of the new object from
an value of the current one.
2. context - (*object*, optional) The object to use as 'this' in the fonction.

#### Arguments paramètres de fn

1. value  - (*mixed*) The current value in the object.
2. key    - (*mixed*) The current value's key in the object.
3. object - (*object*) The actual object.

### Échantillon

```js
var timesTwo = object.map({a: 1, b: 2, c: 3}, function(value, key){
    return value * 2
}) // timesTwo now holds an object containing: {a: 2, b: 4, c: 6}
```

Méthode: filter
--------------

Creates and returns a new object with all of the elements of the object for
which the provided filtering fonction returns `true`.

### Paramètres

1. fn - (*fonction*) The fonction to test each element of the object. This
fonction is passed the value and its key in the object.
2. context - (*object*, optional) The object to use as 'this' in the fonction.

#### Arguments paramètres de fn

1. value  - (*mixed*) The current value in the object.
2. key    - (*mixed*) The current value's key in the object.
3. object - (*object*) The actual object.

### Échantillon

```js
var biggerThanTwenty = object.filter({a: 10, b: 20, c: 30}, function(value, key){
    return value > 20
}) // biggerThanTwenty now holds an object containing: {c: 30}
```

Méthode: every
-------------

Returns `true` if every value in the object satisfies the provided testing
fonction, otherwise this méthode returns `false`.

### Paramètres

1. fn - (*fonction*) The fonction to test each element of the object. This
fonction is passed the value and its key in the object.
2. context - (*object*, optional) The object to use as 'this' in the fonction.

#### Arguments paramètres de fn

1. value  - (*mixed*) The current value in the object.
2. key    - (*mixed*) The current value's key in the object.
3. object - (*object*) The actual object.

### Échantillon

```js
var areAllBigEnough = object.every({a: 10, b: 4, c: 25}, function(value, key){
    return value > 20
}) // areAllBigEnough = false
```

Méthode: some
------------

Returns `true` if at least one value in the object satisfies the provided
testing fonction, otherwise `false` is returned.

### Paramètres

1. fn - (*fonction*) The fonction to test each element of the object. This
fonction is passed the value and its key in the object.
2. context - (*object*, optional) The object to use as 'this' in the fonction.

#### Arguments paramètres de fn

1. value  - (*mixed*) The current value in the object.
2. key    - (*mixed*) The current value's key in the object.
3. object - (*object*) The actual object.

### Échantillon

```js
var areAnyBigEnough = object.some({a: 10, b: 4, c: 25}, function(value, key){
    return value > 20
}) // isAnyBigEnough = true
```

Méthode: index
-------------

Returns the key which is associated with the first found value that is equal
to the passed value. If no value found, `null` is returned.

### Paramètres

1. item - (*mixed*) The item to search for in the object.

### Échantillon

```js
var data = {a: 'one', b: 'two', c: 'three'}
object.index(object, 'two')   // b
object.index(object, 'three') // c
object.index(object, 'four') // null
```

Méthode: remove
--------------

Removes the specified key from the object. Once the item is removed, the
removed value is returned.

### Paramètres

1. key - (*string*) The key to search for in the object.

### Échantillon

```js
var data = {name: 'John', lastName: 'Doe'}
object.remove(object, 'lastName') // returns 'Doe'
// object now holds an object containing: { 'name': 'John' }
```

Méthode: keys
------------

Returns an array containing all the keys.

### Échantillon

```js
var data = {name: 'John', lastName: 'Doe'}
object.keys(data) // ['name', 'lastName']
```

### À voir aussi

[MDN Object.keys](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys)

Méthode: values
--------------

Returns an array containing all the values of the object.

### Échantillon

```js
var data = {name: 'John', lastName: 'Doe'}
object.values(data) // ['John', 'Doe']
```

Module: shell/regexp
====================

Shell module which produits the `es5/regexp` module.

produits
-------

Regexp shell object.

```js
var regexp = require('prime/shell/regexp')
regexp.test(/\s/, 'Does-this-string-contain-whitespace?') // false
```

Module: shell/string
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

Méthode: clean
-------------

Removes all extraneous whitespace from a string and trims it.

### Échantillon

```js
string.clean(' i      like     cookies      \n\n') // returns 'i like cookies'
```

Méthode: camelize
----------------

Converts a hyphenated string to a camelcased string.

### Échantillon

```js
string.camelize('I-like-cookies') // returns 'ILikeCookies'
```

Méthode: hyphenate
-----------------

Converts a camelcased string to a hyphenated string.

### Échantillon

```js
string.hyphenate('ILikeCookies') // returns '-i-like-cookies'
```

Méthode: escape
--------------

Escape an string so it can safely be used in a regular expression.

### Échantillon

```js
string.escape('(un)believable') // "\(un\)believable"
```

Méthode: number
--------------

Tries to parse a string into an number.

### Échantillon

```js
string.number('3.14deg') // 3.14
```

Module: util/emitter
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

Méthode: on
----------

Add a listener to the event emitter, with some specific name.
It returns the emitter instance.

### Paramètres

1. event - (*string*) the name of the event (e.g. 'complete').
2. fn - (*fonction*) the fonction to execute.

### Échantillon

```js
emitter.on('complete', function(){
    console.log('I just completed my action')
})
```

Méthode: off
-----------

Removes an listener from the emitter. It's the opposite operation of `on`.
It returns the emitter instance.

### Paramètres

1. event - (*string*) the name of the event (e.g. 'complete').
2. fn - (*fonction*) the fonction to execute.

### Échantillon

```js
var listener = function(){
    console.log('I just completed my action')
}
emitter.on('complete', listener)
// some while later
emitter.off('complete', listener)
```

Méthode: emit
------------

`emit` calls all registered listeners for a specific event name.
It returns the emitter instance.

### Paramètres

1. event - (*string*) the name of the event (e.g. 'complete').
2. ...arguments - all arguments where `i > 0` are passed as arguments of the
listeners.

### Échantillon

```js
emitter.on('complete', function(a, b){
    console.log('I just ' + a + ' my ' + b) // logs "I just completed my action"
})
emitter.emit('complete', 'completed', 'action')
```

Module: util/map
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

Méthode: set
-----------

Set a new value, or replace an old value.
It returns the map instance.

### Paramètres

1. key - (*mixed*) the key to insert or modify the map.
2. value - (*mixed*) the value to associate with the specified key.

### Échantillon

```js
var myMap = map()
var key = {}
myMap.set(key, 'Michelle')
```

Méthode: get
-----------

Returns the value associated with the given key.

```js
var myMap = map()
var key = {}
myMap.set(key, 'Michelle')
myMap.get(key) // 'Michell'
```

Méthode: count
-------------

Returns the number of items in the map.

```js
var myMap = map()
myMap.set(1, 1).set(2, 2)
myMap.count() // 2
```

Méthode: each
------------

Calls a fonction for each key-value pair in the map. The returned value is
the original map. If the passed fonction returns `false` the loop stops.

### Paramètres

1. fn - (*fonction*) The fonction which should be executed on each item in the
map. This fonction is passed the value and its key in the map.
2. context - (*object*, optional) The object to use as 'this' in the fonction.

#### Paramètre: fn

##### Arguments

1. value - (*mixed*) The current value in the map.
2. key   - (*mixed*) The current value's key in the map.
3. map   - (*map*) The actual map.

### Échantillon

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

### À voir aussi

[prime.each](#Méthode: prime.each)

Méthode: backwards
-----------------

Exactly like `map.each`, except that the loop is reversed.

### Échantillon

```js
var myMap = map()
myMap.set(1, 1).set(2, 2).set(3, 3)
myMap.backwards(function(value, key){
    console.log(value)
}) // logs 3, 2, 1
```

Méthode: map
-----------

Creates and returns a new map with the results of calling a provided fonction on
every value in the map.

### Paramètres

1. fn - (*fonction*) The fonction to produce a value of the new map from
an value of the current one.
2. context - (*object*, optional) The object to use as 'this' in the fonction.

#### Arguments paramètres de fn

1. value - (*mixed*) The current value in the map.
2. key   - (*mixed*) The current value's key in the map.
3. map   - (*map*) The actual map.

### Échantillon

```js
var myMap = map()
myMap.set(1, 1).set(2, 2).set(3, 3)
var timesTwo = myMap.map(function(value, key){
    return value * 2
}) // timesTwo now holds a map where the values are multiplied by 2.
```

Méthode: filter
--------------

Creates and returns a map with all of the elements of the map for
which the provided filtering fonction returns `true`.

### Paramètres

1. fn - (*fonction*) The fonction to test each element of the map. This
fonction is passed the value and its key in the map.
2. context - (*object*, optional) The object to use as 'this' in the fonction.

#### Arguments paramètres de fn

1. value - (*mixed*) The current value in the map.
2. key   - (*mixed*) The current value's key in the map.
3. map   - (*map*) The actual map.

### Échantillon

```js
var myMap = map()
myMap.set(1, 10).set(2, 20).set(3, 30)
var biggerThanTwenty = myMap.filter(function(value, key){
    return value > 20
}) // biggerThanTwenty now holds a map with only the last value (30)
```

Méthode: every
-------------

Returns `true` if every value in the map satisfies the provided testing
fonction, otherwise this méthode returns `false`.

### Paramètres

1. fn - (*fonction*) The fonction to test each element of the map. This
fonction is passed the value and its key in the map.
2. context - (*object*, optional) The object to use as 'this' in the fonction.

#### Arguments paramètres de fn

1. value - (*mixed*) The current value in the map.
2. key   - (*mixed*) The current value's key in the map.
3. map   - (*map*) The actual map.

### Échantillon

```js
myMap.set(1, 10).set(2, 20).set(3, 30)
var areAllBigEnough = myMap.every(function(value, key){
    return value > 20
}) // areAllBigEnough = false
```

Méthode: some
------------

Returns `true` if at least one value in the map satisfies the provided
testing fonction, otherwise `false` is returned.

### Paramètres

1. fn - (*fonction*) The fonction to test each element of the map. This
fonction is passed the value and its key in the map.
2. context - (*object*, optional) The object to use as 'this' in the fonction.

#### Arguments paramètres de fn

1. value - (*mixed*) The current value in the map.
2. key   - (*mixed*) The current value's key in the map.
3. map   - (*map*) The actual map.

### Échantillon

```js
myMap.set(1, 10).set(2, 20).set(3, 30)
var areAnyBigEnough = myMap.some(function(value, key){
    return value > 20
}) // isAnyBigEnough = true
```

Méthode: index
-------------

Returns the key which is associated with the first found value that is equal
to the passed value. If no value found, `null` is returned.

### Paramètres

1. item - (*mixed*) The item to search for in the map.

### Échantillon

```js
myMap.set(1, 10).set(2, 20).set(3, 30)
myMap.index(10) // 1
myMap.index(40) // null
```

Méthode: remove
--------------

Removes the specified key from the map. Once the item is removed, the
removed value is returned.

### Paramètres

1. key - (*mixed*) The key to search for in the map.

### Échantillon

```js
myMap = map()
myMap.set(1, 10).set(2, 20).set(3, 30)
myMap.remove(2) // 20
myMap.get(2) // null
```

Méthode: keys
------------

Returns an array containing all the keys.

### Échantillon

```js
myMap = map()
myMap.set(1, 10).set(2, 20).set(3, 30)
myMap.keys() // [1, 2, 3]
```

Méthode: values
--------------

Returns an array containing all the values of the map.

### Échantillon

```js
var myMap = map()
myMap.set({a: 1}, {b: 1})
myMap.set({a: 2}, {b: 2})
myMap.values() // [{b: 1}, {b: 2}]
```

Module: type
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

