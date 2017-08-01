import test from 'tape'

import logger from '../src/logger';

// TODO write proper test suite

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
        logger: {log: (...args) => logged = args
    }})(Dummy);

    new Dummy();


    t.deepEquals(logged, ['[Dummy]', 'ok']);
    t.end();
});
