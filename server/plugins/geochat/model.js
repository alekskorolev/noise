/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
module.exports = {
  name: "geochat",
  pattern: function (odm) {
    "use strict";
    return {
      title:  String,
      author: odm.Schema.Types.ObjectId,
      body:   String,
      date: { type: Date, default: Date.now },
      point: { type: [Number], default: [0, 0] }
    };
  }
};