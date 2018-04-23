var mongo = require('mongodb').MongoClient;


module.exports = {
    /**
     * get data from mongodb
     * @param type: 'user' or 'card'
     * @param id: userId or cardId
     * @param callback: callback(err, data)
     */
    get : function (type, id, callback) {
        // TODO: use mongodb
        if (type === 'user') {
            console.log('[db/get]: get user ' +id);
            let data = {
                userId: id,
                name: 'aryon',
                stage: [['c0', 'c1', 'c2'],['c2', 'c3', 'c4']],
                pool: ['c0', 'c1', 'c2', 'c3', 'c4'],
                win: 1,
                all: 2
            };
            callback(false, data);
        } else if (type === 'card') {
            console.log('[db/get]: get card ' +id);
            //
        } else if (type === 'question') {
            console.log('[db/get]: get question ' +id);
            let data = {
                question: 'What\'s the weather today?',
                options: ['Fine', 'Bad', 'I don\'t know'],
                answer: 0
            };
            callback(false, data);
        } else {
            callback(new Error('db type error'), {});
        }
    },
    update : function (type, id, data, callback) {
        //
    },
    del : function (type, id, callback) {
        //
    },
    add : function (type, id, data, callback) {
        //
    }
};