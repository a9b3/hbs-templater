# hbs-templater
[![Build Status](https://travis-ci.org/esayemm/hbs-templater.svg?branch=master)](https://travis-ci.org/esayemm/hbs-templater)

Command line tool for compiling handlebars templates.

## Install

```sh
npm i -g hbs-templater
```

#### Command Line

```sh
hbs-templater compile \
	--params "{'foo': 'bar'}" \
	--input ./foo \
	--output ./bar
```

#### Module

```javascript
import path from 'path'
import { compile } from 'hbs-templater'

compile({
	params: {
		foo: 'bar',
	},
	input: path.resolve('./foo'),
	output: path.resolve('./bar'),
})
```