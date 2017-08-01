'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = addLogger;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
function addLogger() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'logger';

    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$logger = _ref.logger,
        logger = _ref$logger === undefined ? console : _ref$logger,
        _ref$functions = _ref.functions,
        functions = _ref$functions === undefined ? ['log', 'warn', 'info', 'error', 'debug', 'trace'] : _ref$functions,
        _ref$accessor = _ref.accessor,
        accessor = _ref$accessor === undefined ? 'logger' : _ref$accessor,
        _ref$prefixer = _ref.prefixer,
        prefixer = _ref$prefixer === undefined ? function (name) {
        return '[' + name + ']';
    } : _ref$prefixer;

    return function decorateClass(target) {
        var customLogger = functions.reduce(function (result, fn) {
            return Object.assign(result, _defineProperty({}, fn, function () {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                var prefix = prefixer(typeof name === 'function' ? name({ target: target, args: args }) : name);
                var logArgs = [prefix].concat(args);
                var loggers = Array.isArray(logger) ? logger : [logger];
                loggers.forEach(function (logger) {
                    return logger[fn].apply(logger, logArgs);
                });
                return true;
            }));
        }, {});
        if (accessor === 'this') {
            Object.assign(target.prototype, customLogger);
        } else {
            target.prototype[accessor] = customLogger;
        }
    };
}