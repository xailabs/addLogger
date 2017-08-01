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
