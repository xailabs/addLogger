/**
 * A class decorator that adds a logger object to class instances.
 * The logger object prepends a specified name to all log output.
 *
 * Unless you specify a custom `accessor`, the logger object is available via `this.logger` and you can use it as in `this.logger.warn('oh noes!')`.
 * A special case is `accessor: 'this'`- it leads to the log methods being available onthe decorated instance directly and you can use it as in `this.warn('oh noes!')`.
 *
 * @param {string|function} [name='logger'] - The name prefix. Prepended to all output of the created logger. If it is a function, the function should return a string.
 * @param {object} [config] - An optional configuration object.
 * @param {object|array} [config.logger = window.console] - The logger object that will be used. Can also be an array of logger objects.
 * @param {array} [config.functions = ['log', 'warn', 'info', 'error', 'debug', 'trace']] - An array of function names supported by the `logger` object..
 * @param {string} [config.accessor='logger'] - The name by which the logger object can be accessed on the decorated instance.
 * @param {function} [config.prefixer = (name) => `[${name}]`] - A function that creates the prefix. Receives the `name` string and should return a string.
 * @return {bool} - Always returns `true`. (Allows usage as in `(args) => this.logger.log(args) && doSomething(args)`)
 *
 * @example
 * import React from 'react';
 * import addLogger from '@xailabs/addLogger';
 * @addLogger('App')
 * class App extends React.Component {
 *      componentDidMount() {
 *          this.logger.warn('watch out!'); // logs '[App] watch out!'
 *      }
 * }
 */
export default function addLogger(name = 'logger', {
    logger = console,
    functions = ['log', 'warn', 'info', 'error', 'debug', 'trace'],
    accessor = 'logger',
    prefixer = (name) => `[${name}]`
} = {}) {
    return function decorateClass(target) {
        const customLogger = functions.reduce((result, fn) => {
            return Object.assign(result, {
                [fn]: (...args) => {
                    const prefix = prefixer(typeof name === 'function' ? name({target, args}) : name);
                    const logArgs = [prefix, ...args];
                    const loggers = Array.isArray(logger) ? logger : [logger];
                    loggers.forEach(logger => logger[fn].apply(logger, logArgs));
                    return true;
                }
            });
        }, {});
        if (accessor === 'this') {
            Object.assign((target.prototype || target), customLogger);
        }
        else {
            (target.prototype || target)[accessor] = customLogger;
        }
    };
}
