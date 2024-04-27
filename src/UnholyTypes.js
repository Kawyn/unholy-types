class UnholyParser {

    static REGEX = /\/\*[\s\S]*?\*\/[\s\S]*?[a-zA-Z]*\([a-zA-Z, ]*?\)/g;

    static parseClass(code) {

        const result = {};

        const functionsWithComments = code.match(this.REGEX);

        if (!functionsWithComments)
            return result;

        for (const pair of functionsWithComments) {

            const [comment, func] = pair.split('*/').map(v => v.trim());

            const functionName = func.split('(')[0].trim();

            const paramTypes = comment.split('*').join('').split('\n').map(v => v.trim()).filter(v => v.includes('@param'));
            const paramNames = func.split('(')[1].split(')')[0].split(',').map(v => v.trim());

            const paramsWithTypes = []

            for (const str of paramTypes) {

                const type = str.split('{')[1].split('}')[0].trim();
                const param = str.split('}')[1].split(' ')[1].trim();

                const idx = paramNames.indexOf(param);

                if (idx !== -1)
                    paramsWithTypes[idx] = type.split('|');
            }

            result[functionName] = paramsWithTypes;
        }

        return result;
    }

    static parseFunction(code) {

        return code.split('(')[1].split(')')[0].split(',').map(v => v.trim());

    }
}

class UnholyTypes {

    static #CONSTRUCTOR = 'constructor';
    static #DESECRATED_CLASSES = {};

    static WrongTypeErrorHandler = (name, param, type, value) => {

        const error = new TypeError(`Trying to call ${name} with ${param} as ${value} (${typeof value}) while ${type} is expected.`);
        const stack = error.stack.split('at ');
        stack.splice(1, 2);
        error.stack = stack.join('at ')

        throw error;
        // or return true; 
    }

    constructor() {

        this.#desecrateClass(this.constructor)
    }

    #desecrateClass(constructor) {

        if (UnholyTypes.#DESECRATED_CLASSES[constructor.name])
            return;

        UnholyTypes.#DESECRATED_CLASSES[constructor.name] = true;

        const properties = Object.getOwnPropertyNames(constructor.prototype);
        const params = UnholyParser.parseClass(constructor.toString());

        for (let property of properties) {

            if (property === UnholyTypes.#CONSTRUCTOR)
                continue;

            if (!params[property])
                continue;

            const func = this.constructor.prototype[property];
            this.constructor.prototype[property] = this.#desecrateFunction(func, property, params[property]);
        }

        const parent = Object.getPrototypeOf(constructor);

        // recursive inherence or something
        if (parent.name)
            this.#desecrateClass(parent);
    }

    #desecrateFunction(func, name, types) {

        const params = UnholyParser.parseFunction(func.toString());

        return function (...args) {

            for (let i = 0; i < params.length; i++) {

                if (!types[i])
                    continue;

                if (!types[i].includes(typeof args[i])) {

                    if (this.constructor.WrongTypeErrorHandler(name, params[i], types[i], args[i]))
                        return;
                }
            }

            return func(...args);
        }
    }
}

module.exports = UnholyTypes;