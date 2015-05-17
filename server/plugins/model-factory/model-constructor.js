/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */

var mongoose = require('mongoose');
// model constructor
var Model = function (options) {
  "use strict";
  if (typeof (options.pattern) === "function") {
    this.pattern = options.pattern(mongoose);
  } else {
    this.pattern = options.pattern;
  }
  this.name = options.name;
  this.Schema = new mongoose.Schema(this.pattern);
  this.Model = mongoose.model(this.name, this.Schema);
};
Model.prototype = require('./model-proto');

module.exports = Model;