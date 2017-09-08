import test from 'tape'

import logger from '../src/logger';

// TODO write proper test suite

test('Creates a new logger when ivoked without target', (t) => {
    let logged;
    const l = logger('foo', {
        backend: {log: (...args) => logged = args}
    })();
    l.log('ok')
    t.deepEquals(logged, ['[foo]', 'ok']);
    t.end();
});

test('Adds logger to plain object', (t) => {
    const obj = {};
    logger()(obj);
    t.ok(obj.logger);
    t.end();
});

test('Adds logger to class prototype', (t) => {
    class Dummy {};
    logger()(Dummy);
    t.ok(Dummy.prototype.logger);
    t.end();
});

test('Adds name prefix to messages', (t) => {
    let logged;
    class Dummy {
        constructor() { this.logger.log('ok'); }
    };

    logger('Dummy', {
        backend: {log: (...args) => logged = args}
    })(Dummy);

    new Dummy();


    t.deepEquals(logged, ['[Dummy]', 'ok']);
    t.end();
});

test('Respects log level string', (t) => {
    let logged = [];

    class Dummy {
        constructor() {
            this.logger.log('log');
            this.logger.info('info');
            this.logger.warn('warn');
        }
    };

    logger('Dummy', {
        backend: {
            log: (...args) => logged.push(args.join(' ')),
            info: (...args) => logged.push(args.join(' ')),
            warn: (...args) => logged.push(args.join(' ')),
        },
        level: 'info'
    })(Dummy);

    new Dummy();


    t.deepEquals(logged, ['[Dummy] log', '[Dummy] info']);
    t.end();
});

test('Respects log level number', (t) => {
    let logged = [];

    class Dummy {
        constructor() {
            this.logger.log('log');
            this.logger.info('info');
            this.logger.warn('warn');
        }
    };

    logger('Dummy', {
        backend: {
            log: (...args) => logged.push(args.join(' ')),
            info: (...args) => logged.push(args.join(' ')),
            warn: (...args) => logged.push(args.join(' ')),
        },
        level: 1
    })(Dummy);

    new Dummy();


    t.deepEquals(logged, ['[Dummy] log', '[Dummy] info']);
    t.end();
});
