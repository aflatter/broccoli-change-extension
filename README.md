A plugin for [Broccoli](https://github.com/broccolijs/broccoli) that changes
the extension of each file in a given tree.

## Installation

```bash
npm install --save-dev broccoli-change-extension
```

## Usage

```js
var changeExtension = require('broccoli-change-extension');

changeExtension(tree, {
  inputExtension: '.handlebars', outputExtension: '.html'
});
```
