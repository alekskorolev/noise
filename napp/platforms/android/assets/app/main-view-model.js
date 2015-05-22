/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
var ImageModule = require("ui/image");
var listViewModule = require("ui/list-view");
var __extends = this.__extends || function (d, b) {
  "use strict";
  for (var p in b)
    if (b.hasOwnProperty(p)) d[p] = b[p];

  function __() {
    this.constructor = d;
  }
  __.prototype = b.prototype;
  d.prototype = new __();
};
var observable = require("data/observable");
var HelloWorldModel = (function (_super) {
  "use strict";
  __extends(HelloWorldModel, _super);

  function HelloWorldModel() {
    _super.call(this);
    this.msgs = [
      {title: "Msg 1"},
      {title: "Msg 2"},
      {title: "Msg 3"}
    ];
  }
  HelloWorldModel.prototype.tapAction = function () {
    this.counter--;
    if (this.counter <= 0) {
      this.set("message", "Hoorraaay! You unlocked the NativeScript clicker achievement!");
    } else {
      this.set("message", this.counter + " taps left");
    }
  };
  return HelloWorldModel;
})(observable.Observable);
exports.HelloWorldModel = HelloWorldModel;
exports.mainViewModel = new HelloWorldModel();