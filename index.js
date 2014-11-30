var RSVP = require('rsvp'),
    fs = require('fs-extra'),
    path = require('path'),
    readDirectory = require('fs-readdir-recursive'),
    Writer = require('broccoli-writer');

function ChangeExtension(inputTree, options) {
  if (!(this instanceof ChangeExtension)) {
    return new ChangeExtension(inputTree, options);
  }

  if (typeof options.inputExtension === 'undefined') {
    throw new TypeError('the `inputExtension` option is required');
  }

  if (typeof options.outputExtension === 'undefined') {
    throw new TypeError('the `outputExtension` option is required');
  }

  this.inputTree = inputTree;
  this.inputExtension = options.inputExtension;
  this.outputExtension = options.outputExtension;
}

ChangeExtension.prototype = Object.create(Writer.prototype);
ChangeExtension.prototype.constructor = ChangeExtension;

ChangeExtension.prototype.write = function(readTree, outputDir) {
  var inputExtension = this.inputExtension,
      outputExtension = this.outputExtension;

  return readTree(this.inputTree).then(function(inputDir) {
    return RSVP.all(readDirectory(inputDir).map(function(inputPath) {
      var fullInputPath, fullOutputPath;
      
      fullInputPath = path.join(inputDir, inputPath),
      fullOutputPath = path.join(outputDir, changeExtension(
        inputPath, inputExtension, outputExtension
      ));

      return copy(fullInputPath, fullOutputPath);
    }, this));
  }.bind(this));
};

/** Changes the extension of a given path. */
function changeExtension(inputPath, inputExtension, outputExtension) {
  var inputDirname = path.dirname(inputPath),
      inputBasename = path.basename(inputPath, inputExtension);

  return path.join(inputDirname, inputBasename + outputExtension);
}

/** A promise-enabled `fs-extra.copy`. */
function copy(src, dst) {
  return new RSVP.Promise(function(resolve, reject) {
    fs.copy(src, dst, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = ChangeExtension;
