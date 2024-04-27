JavaScript runtime decorator that enforces types in class methods

## Setup
To decorate Your functions with type checkers just inherit after `UnholyTypes`:

```js
class YourSuperbClass extends UnholyTypes { }
```

Due to some heresy, Unholy Types ensures that when calling a function, parameters are of the type given in the JSDoc (currently only works for primitives), e.g.:

```js
class LoremIpsum extends UnholyTypes {

    /**
     * 
     * @param {string|number} str 
     * @param {number} num 
     */
    test(str, num) {

        console.log(str, num);
    }
}

let x = new LoremIpsum();

x.test(3, 2); // pasess
x.test('a', 'b'); // throws error
```
