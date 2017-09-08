# @xailabs/logger

A class decorator that adds a `logger` object to instances.
The logger object prepends a name to all of its output.

Very usefull when working with many different components, or sources of log messages in general.

Documentation: [https://xailabs.github.io/logger/](https://xailabs.github.io/logger/)

## Installation

    npm install @xailabs/logger

or:

    yarn add @xailabs/logger

## Examples

Default usage with [decorator syntax](https://www.npmjs.com/package/babel-plugin-transform-decorators-legacy):

    import {Component} from 'react';
    import logger from '@xailabs/logger';
    @logger('App')
    class App extends Component {
         componentDidMount() {
             this.logger.warn('watch out!'); // logs a warning '[App] watch out!'
         }
    }

Without decorator syntax

    class App extends Component {
         componentDidMount() {
             this.logger.log('ok');
         }
    }
    logger('App')(App);


Without target - creates a new logger object

    import {Component} from 'react';
    import createLogger from '@xailabs/logger';
    const logger = createLogger('App')();
    logger.info('ok');

With log level. (See `config.level` in the [docs](https://xailabs.github.io/logger/function/index.html#static-function-logger) for details)

    const logLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'info';
    @logger('App', {level: logLevel})
    class App extends Component {
         componentDidMount() {
            this.logger.log('ok'); // logs in both production and development
            this.logger.info('ok'); // logs in both production and development
            this.logger.warn('watch out!'); // only logs in development
         }
    }


Using a function instead of a string as name - retrieves dynamic values

    @logger(() => new Date().toISOString())
    class App extends Component {
         componentDidMount() {
             this.log('ok'); // logs something like '[2017-08-01T16:37:14.444Z] ok'
         }
    }   

Custom accessor

    @logger('App', {accessor: 'logging'})
    class App extends Component {
         componentDidMount() {
             this.logging.log('ok'); // access via this.logging
         }
    }   

Magic 'this' accessor

    @logger('App', {accessor: 'this'})
    class App extends Component {
         componentDidMount() {
             this.log('ok'); // access via this.log() instead of this.something.log()
         }
    }   

Custom log backend:

    @logger('App', {backend: require('winston')})
    class App extends Component {
         componentDidMount() {
             this.logger.log('ok'); // logs using winston instead of the console
         }
    }   

Multiple log backends:

    @logger('App', {backend: [window.console, require('winston'), anotherCustomLogger})
    class App extends Component {
         componentDidMount() {
             this.logger.log('ok'); // logs to all the logger objects that have a "log" function
         }
    }   
