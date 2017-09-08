/**
 * A class decorator that adds a logger object to class instances.
 * The logger object prepends a specified name to all log output.
 *
 * Unless you specify a custom `accessor`, the logger object is available via `this.logger` and you can use it as in `this.logger.warn('oh noes!')`.
 * A special case is `accessor: 'this'`- it leads to the log methods being available onthe decorated instance directly and you can use it as in `this.warn('oh noes!')`.
 *
 * @param {string|function} [name='logger'] - The name prefix. Prepended to all output of the created logger. If it is a function, the function should return a string.
 * @param {object} [config] - An optional configuration object.
 * @param {object|array} [config.backend = window.console] - The logger object that will be used. Can also be an array of logger objects.
 * @param {array} [config.functions = ['log', 'info', 'warn', 'error', 'trace', 'table', 'debug']] - An array of function names supported by the `logger` object..
 * @param {string} [config.accessor='logger'] - The name by which the logger object can be accessed on the decorated instance.
 * @param {function} [config.prefixer = (name) => `[${name}]`] - A function that creates the prefix. Receives the `name` string and should return a string.
 * @param {string|number} [config.level = debug] - A log level name. Should be either a number or one of the available `functions` (the array index is the numeric level), decides whether the message will be printed. E.g. the lowest level is `log` - only `logger.log()` will be printed, while the highest level is `debug` (last array element)
 * @return {bool} - Always returns `true`. (Allows usage as in `(args) => this.logger.log(args) && doSomething(args)`)
 *
 * @example
 * import React from 'react';
 * import logger from '@xailabs/logger';
 * @logger('App')
 * class App extends React.Component {
 *      componentDidMount() {
 *          this.logger.warn('watch out!'); // logs '[App] watch out!'
 *      }
 * }
 */
export default function logger(name = 'logger', {
    backend = console,
    functions = ['log', 'info', 'warn', 'error', 'trace', 'table', 'debug', 'dir'],
    accessor = 'logger',
    prefixer = (name) => `[${name}]`,
    level = 'debug'
} = {}) {
    return function decorateClass(target) {
        if (!target) {
            target = Object.create(null);
            accessor = 'this';
        }
        const customLogger = functions.reduce((result, fn) => {
            result[fn] = (function(...args) {
                const fnLevel = functions.indexOf(fn);
                const allowedLevel = typeof level === 'number' ? level : functions.indexOf(level);
                if (!allowedLevel || fnLevel > allowedLevel) {
                    return;
                }
                const prefix = prefixer(typeof name === 'function' ? name({target, args}) : name);
                const logArgs = [prefix, ...args];
                const backends = Array.isArray(backend) ? backend : [backend];
                backends.forEach(backend => backend[fn].apply(backend, logArgs));
                return true;
            }).bind(result);
            return result;
        }, {});
        if (accessor === 'this') {
            Object.assign((target.prototype || target), customLogger);
        }
        else {
            (target.prototype || target)[accessor] = customLogger;
        }
        return target;
    };
}
