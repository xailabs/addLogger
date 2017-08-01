# @xailabs/logger

A class decorator that adds a `logger` object to instances.
The logger object prepends a name to all output.

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

    import {Component} from 'react';
    import logger from '@xailabs/logger';
    class App extends Component {
         componentDidMount() {
             this.logger.log('ok');
         }
    }
    logger('App')(App);

Timestamp in prefix:

    @logger(() => `App (${new Date().toISOString()})`)
    class App extends Component {
         componentDidMount() {
             this.log('ok'); // logs something like '[App  (2017-08-01T16:37:14.444Z)] ok'
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
             this.log('ok'); // access via this
         }
    }   

Custom logger:

    @logger('App', {logger: require('winston')})
    class App extends Component {
         componentDidMount() {
             this.log('ok'); // logs using winston
         }
    }   

Multiple loggers:

    @logger('App', {logger: [window.console, require('winston'), anotherCustomLogger})
    class App extends Component {
         componentDidMount() {
             this.log('ok'); // logs to window.console and winston
         }
    }   
