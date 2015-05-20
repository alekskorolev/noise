/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
var Deferred = require('promised-io/promise').Deferred;
module.exports = {
  save: function (doc) {
    "use strict";
    var deferred = new Deferred();
    if (doc) {
      if (doc._id) {
        this.Model.findByIdAndUpdate(doc._id, { $set: doc}, function (err, model) {
          if (err) {
            deferred.reject(err);
          } else if (!model) {
            deferred.reject(new Error('Model not found'));
          } else {
            deferred.resolve(model);
          }
        });
      } else {
        this.Model.create(doc, function (err, model) {
          if (err) {
            deferred.reject(err);
          } else {
            deferred.resolve(model);
          }
        });
      }
    } else {
      deferred.reject(new Error('Saved data is empty'));
    }
    return deferred.promise;
  },
  remove: function (doc) {
    "use strict";
    var deferred = new Deferred();
    if (!doc) {
      deferred.reject(new Error('Document needed'));
    } else if (doc._id) {
      this.Model.findByIdAndRemove(doc._id, function (err, model) {
        if (err) {
          deferred.reject(err);
        } else if (!model) {
          deferred.reject(new Error('Document not found'));
        } else {
          deferred.resolve(model);
        }
      });
    } else {
      deferred.reject(new Error('Document _id needed'));
    }
    return deferred.promise;
  },
  get: function (query) {
    "use strict";
    var deferred = new Deferred();
    if (!query) {
      deferred.reject(new Error('Query is needed'));
    } else if (query._id) {
      this.Model.findById(query._id, function (err, model) {
        if (err) {
          deferred.reject(err);
        } else if (!model) {
          deferred.reject(new Error('Document not found'));
        } else {
          deferred.resolve(model);
        }
      });
    } else {
      this.Model.findOne(query, function (err, model) {
        if (err) {
          deferred.reject(err);
        } else if (!model) {
          deferred.reject(new Error('Document not found'));
        } else {
          deferred.resolve(model);
        }
      });
    }
    return deferred.promise;
  },
  fetch: function (query) {
    "use strict";
    var deferred = new Deferred(),
      q;
    if (query) {
      q = this.Model.find();
      if (query.where) {
        q = q.where(query.where);
      }
      q.exec(function (err, list) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(list);
        }
      });
    } else {
      deferred.reject(new Error('Query is empty, but need object'));
    }
    return deferred.promise;
  },
  count: function (query) {
    "use strict";
    var deferred = new Deferred(),
      q;
    if (query) {
      q = this.Model.count();
      if (query.where) {
        q = q.where(query.where);
      }
      q.exec(function (err, list) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve(list);
        }
      });
    } else {
      deferred.reject(new Error('Query is empty, but need object'));
    }
    return deferred.promise;
  }
};