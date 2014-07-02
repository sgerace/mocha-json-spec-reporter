// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Node dependencies

var util = require('util');
var fs = require('fs');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Mocha dependencies

var mocha = require('mocha');
var Base = mocha.reporters.Base,
    cursor = Base.cursor,
    color = Base.color;

module.exports = Reporter;

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

    var tests = [],
        failures = [],
        passes = [];

    var options = {
        dest: './';
    }
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
    });

    runner.on('suite end', function(suite) {
        --indents;
        if (1 == indents) console.log();
    });

    runner.on('test end', function(test) {
        tests.push(test);
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
        passes.push(test);
    });

    runner.on('fail', function(test) {
        cursor.CR();
        console.log(indent() + color('fail', '  %d) %s'), ++n, test.title);
        failures.push(test);
    });

    runner.on('end', function() {
        self.epilogue();

        var obj = {
            stats: self.stats,
            tests: tests.map(clean),
            failures: failures.map(clean),
            passes: passes.map(clean)
        };
        var jsonOutput = JSON.stringify(obj, null, 2);
        //process.stdout.write(jsonOutput);

        try {
            util.print("\nGenerating report.json file");
            var out = fs.openSync(options.dest, "w");

            fs.writeSync(out, jsonOutput);
            fs.close(out);
            util.print("\nGenerating report.json file complete in " + options.dest + "\n")
        } catch (error) {
            util.print("\nError: Unable to write to file report.json\n");
        }
    });
}

/**
 * Return a plain-object representation of `test`
 * free of cyclic properties etc.
 *
 * @param {Object} test
 * @return {Object}
 * @api private
 */

function clean(test) {
    return {
        title: test.title,
        fullTitle: test.fullTitle(),
        duration: test.duration
    }
}