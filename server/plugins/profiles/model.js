/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
module.exports = {
  name: "model",
  pattern: function (odm) {
    "use strict";
    return {
      dispname:  String,
      firstname: String,
      lastname: String,
      avatar: String,
      date: { type: Date, default: Date.now }
    };
  }
};