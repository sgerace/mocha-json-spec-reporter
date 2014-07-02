A Spec JSON Reporter for Mocha
==============================

## Options

There are multiple ways to set global options:

````js
//on module using .option() method
require('mocha-json-spec-reporter').option('<option_name>', <option_value>);
//or on env with prefixed name
process.env['mocha-json-spec-<option_name>'] = <option_value>;
//env also work Bash-style: upper-cased and underscores instead of dashes
process.env['MOCHA_JSON_SPEC_<OPTION_NAME>'] = <option_value>;
````

These are equivalent:

````js
process.env['MOCHA_JSON_SPEC_REPORTPENDING'] = true;
process.env['mocha-json-spec-reportPending'] = true;

require('mocha-json-spec-reporter').option('reportPending', true);
require('mocha-json-spec-reporter').option({reportPending: true});
````