/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
module.exports = [
  {
    name: "user",
    pattern: function (odm) {
      "use strict";
      return {
        title:  String,
        author: String,
        body:   String,
        comments: [{ body: String, date: Date }],
        date: { type: Date, default: Date.now },
        hidden: Boolean,
        meta: {
          votes: Number,
          favs:  Number
        }
      };
    }
  },
  {
    name: "blog",
    pattern: {
      title:  String,
      author: String,
      body:   String,
      comments: [{ body: String, date: Date }],
      date: { type: Date, default: Date.now },
      hidden: Boolean,
      meta: {
        votes: Number,
        favs:  Number
      }
    }
  },
  {
    name: "articles",
    pattern: function (odm) {
      "use strict";
      return {
        title:  String,
        author: String,
        body:   String,
        comments: [{ body: String, date: Date }],
        date: { type: Date, default: Date.now },
        hidden: Boolean,
        meta: {
          votes: Number,
          favs:  Number
        }
      };
    }
  }
]