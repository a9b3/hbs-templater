# hbs-templater

Command line tool for compiling handlebars templates.

ex.

```sh
hbs-templater compile --params "{'foo': 'bar'}" --input ./foo --output ./bar

# or from a params json file
hbs-templater compile --paramsFile ./params.json --input ./foo --output ./bar

# or from a params js file, which module.exports an object
hbs-templater compile --paramsJsFile ./params.js --input ./foo --output ./bar
```

## Install

```sh
npm i -g hbs-templater
```