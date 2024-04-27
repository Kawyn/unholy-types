const UnholyTypes = require("./UnholyTypes");

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