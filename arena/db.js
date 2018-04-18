var mongo = require('mongodb').MongoClient;

/**
 * @type {{db: module.exports.db}}
 */

module.exports = {
    db : function () {
        this.get = function (type, id, callback) {
            // TODO:
        };
        this.update = function (type, id, data, callback) {
            //
        };
        this.del = function (type, id, callback) {
            //
        };
        this.add = function (type, id, data, callback) {
            //
        };
    }
};