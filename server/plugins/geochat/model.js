/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
module.exports = {
  msgs: {
    name: "geochat_msgs",
    pattern: function (odm) {
      "use strict";
      return {
        uid: String,
        msg:   String,
        date: { type: Date, default: Date.now },
        pos: { type: [Number], default: [0, 0] }
      };
    },
    index: {pos: '2dsphere'}
  },
  peoples: {
    name: "geochat_peoples",
    pattern: function (odm) {
      "use strict";
      return {
        uid: {type: String, index: true},
        pos: { type: [Number], default: [0, 0] },
        sid: { type: String, default: ""}
      };
    }
  },
  index: {pos: '2dsphere'}
};