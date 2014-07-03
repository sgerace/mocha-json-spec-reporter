// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Node dependencies

var fs = require('fs');
var fspath = require('path');
var mkdirp = require('mkdirp');
var util = require('util');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Mocha dependencies

var mocha = require('mocha');
var Base = mocha.reporters.Base,
    cursor = Base.cursor,
    color = Base.color;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Library dependencies

var ms = require('./ms');


module.exports = Reporter;


function Suite(suite) {
    if (suite) {
        this.title = suite.title;
        this.timeout = suite._timeout;
        this.slow = suite._slow;
    }
    this.suites = [];
    this.tests = [];
}

function Test(test) {
    this.title = test.title;
    this.fullTitle = test.fullTitle();
    this.timedOut = test.timedOut;
    this.duration = test.duration;
    this.speed = test.speed;
    this.file = test.file;
    this.state = test.state;
}



function top(array) {
    return array[array.length - 1];
}

/**
 * Initialize a new `JSON` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Reporter(runner) {
    Base.call(this, runner);

    var self = this;
    var stats = this.stats;
    var indents = 0;
    var n = 0;

    var root = new Suite();
    var stack = [root];

    var options = {
        dest: './'
    };
    for (var p in options) {
        if (typeof process.env['mocha-json-spec-' + p] === 'string') {
            options[p] = process.env['mocha-json-spec-' + p];
        } else if (typeof process.env['MOCHA_JSON_SPEC_' + p.toUpperCase()] === 'string') {
            options[p] = process.env['MOCHA_JSON_SPEC_' + p.toUpperCase()];
        }
    }

    function indent() {
        return Array(indents).join('  ')
    }

    runner.on('start', function() {
        console.log();
    });

    runner.on('suite', function(suite) {
        ++indents;
        console.log(color('suite', '%s%s'), indent(), suite.title);
        if (suite.root) {
            return;
        }
        var parent = top(stack);
        var child = new Suite(suite);
        parent.suites.push(child);
        stack.push(child);
    });

    runner.on('suite end', function(suite) {
        --indents;
        if (1 == indents) {
            console.log();
        }
        stack.pop();
    });

    runner.on('test end', function(test) {
        top(stack).tests.push(new Test(test));
    });

    runner.on('pending', function(test) {
        var fmt = indent() + color('pending', '  - %s');
        console.log(fmt, test.title);
    });

    runner.on('pass', function(test) {
        if ('fast' == test.speed) {
            var fmt = indent() + color('checkmark', '  ' + Base.symbols.ok) + color('pass', ' %s ');
            cursor.CR();
            console.log(fmt, test.title);
        } else {
            var fmt = indent() + color('checkmark', '  ' + Base.symbols.ok) + color('pass', ' %s ') + color(test.speed, '(%dms)');
            cursor.CR();
            console.log(fmt, test.title, test.duration);
        }
        var current = top(stack);
    });

    runner.on('fail', function(test) {
        cursor.CR();
        console.log(indent() + color('fail', '  %d) %s'), ++n, test.title);
    });

    runner.on('end', function() {

        // Epilogue
        var fmt;
        try {
            console.log(color('bright yellow', '  Summary'));

            // Passes
            fmt = color('bright pass', ' ');
            fmt += color('green', ' %d passing');
            fmt += color('light', ' (%s)');
            console.log(fmt, stats.passes || 0, ms(stats.duration));

            // Pending
            if (stats.pending) {
                fmt = color('pending', ' ');
                fmt += color('pending', ' %d pending');
                console.log(fmt, stats.pending);
            }

            // Failures
            if (stats.failures) {
                fmt = color('fail', '  %d failing');
                console.error(fmt, stats.failures);
                Base.list(self.failures);
                console.error();
            } else {
                console.log();
            }
        } catch (error) {
            console.log(color('fail', 'Error occurred when generating epilogue'));
            console.log(error);
        }


        // Json        
        var obj = {
            stats: self.stats,
            results: root
        };
        try {
            console.log(color('bright yellow', '  Export'));
            var dir = fspath.dirname(options.dest);
            var str = JSON.stringify(obj, null, 2);
            mkdirp.sync(dir);
            fs.writeFileSync(options.dest, str);
            console.log(color('green', '  Successfully written to %s'), options.dest);
        } catch (error) {
            console.log(color('fail', '  Failed to export to %s'), options.dest);
            console.log(error);
        }

        // Add extra space
        console.log();
    });
}