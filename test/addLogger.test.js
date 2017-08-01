import test from 'tape'

import addLogger from '../src/addLogger';

// TODO write proper test suite

test('Adds logger to plain object', (t) => {
    const obj = {};
    addLogger()(obj);
    t.ok(obj.logger);
    t.end();
});

test('Adds logger to class prototype', (t) => {
    class Dummy {};
    addLogger()(Dummy);
    t.ok(Dummy.prototype.logger);
    t.end();
});
