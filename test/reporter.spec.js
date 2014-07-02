var Reporter = require('../lib/reporter');

describe("Reporter", function() {

    var reporter, on, expected;

    beforeEach(function() {
        runner = {
            on: function(type, listener) {}
        };
        reporter = new Reporter(runner);
        console.log(reporter);
    });

    it("should create a key for the suite", function() {

        


        
    });

    // it("should return the value FAILED for failing test", function() {
    //     reporter.onTestEnd({
    //         title: 'a description',
    //         state: 'failed',
    //         parent: {
    //             title: 'a suite'
    //         }
    //     });

    //     expected = {
    //         "a suite" : {
    //             "a description" : "FAILED"
    //         }
    //     }
    //     assert.deepEqual(reporter.output, expected);
    // });

    // it("should flatten nested tests that have multiple suites", function() {
    //     reporter.onTestEnd({
    //         title: 'a description',
    //         state: 'passed',
    //         parent: {
    //             title: 'a suite',
    //             parent: {
    //                 title: 'parent'
    //             }
    //         }
    //     });
    //     expected = {
    //         "a suite parent" : {
    //             "a description" : "PASSED"
    //         }
    //     }
    //     assert.deepEqual(reporter.output, expected);
    // });

});