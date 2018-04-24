const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

const dbName = 'ub_game';

let initiated = false;

module.exports = {
    /**
     * init db and create index for all 3 collections
     * @param callback: function(err, result)
     */
    init: function (callback) {
        MongoClient.connect(url, function (err, client) {
            const userCol = client.db(dbName).collection('user');
            const cardCol = client.db(dbName).collection('card');
            const quesCol = client.db(dbName).collection('question');
            userCol.createIndex({userId: 'text'}, {unique: true}, function (err, result) {
                if (err) console.log('[db/init]: create index for user error');
                callback(err, result);
            });
            cardCol.createIndex({cardId: 'text'}, {unique: true}, function (err, result) {
                if (err) console.log('[db/init]: create index for card error');
                callback(err, result);
            });
            quesCol.createIndex({questionId: 'text'}, {unique: true}, function (err, result) {
                if (err) console.log('[db/init]: create index for question error');
                callback(err, result);
            });
            client.close();
            initiated = true;
        });
    },

    /**
     * initiate db by some test cases
     * @param callback: function(err, result)
     */
    init_test: function (callback) {
        MongoClient.connect(url, function (err, client) {
            // client.db(dbName).collection('user').drop();
            // client.db(dbName).collection('card').drop();
            // client.db(dbName).collection('question').drop();
            let userCol = client.db(dbName).collection('user');
            userCol.insertMany([{
                userId: 'u123',
                name: 'aryon',
                stage: [['c0', 'c1', 'c2'],['c2', 'c3', 'c4']],
                pool: ['c0', 'c1', 'c2', 'c3', 'c4'],
                win: 1,
                all: 2
            }, {
                userId: 'u124',
                name: 'dai',
                stage: [['c0', 'c1', 'c2'],['c2', 'c3', 'c4']],
                pool: ['c0', 'c1', 'c2', 'c3', 'c4'],
                win: 1,
                all: 2
            }], function (err, result) {
                if (err) {
                    console.log('[db/init_test]: user insert many error.');
                    callback(err, {});
                } else {
                    if (result.insertedCount === 2) {
                        callback(false, result);
                    } else {
                        console.log('[db/init_test]: user insert count error');
                        callback(new Error('Insert Count Error'), {});
                    }
                }
            });

            let cardCol = client.db(dbName).collection('card');
            cardCol.insertMany([{
                cardId: 'c0',
                name: 'dark flame master',
                atk: 10,
                cost: 3,
                property: 'dark',
                growth: ['marshal'],
                effect: 'fool rival, emmm...',
                description: 'a monster in anime Chuunibyou Demo Koi Ga Shitai.'
            }, {
                cardId: 'c1',
                name: 'Blue-Eyes White Dragon',
                atk: 3000,
                cost: 8,
                property: 'light',
                growth: ['marshal'],
                effect: 'Nothing',
                description:    'This legendary dragon is a powerful engine of destruction. '+
                                'Virtually invincible, very few have faced this awesome ' +
                                'creature and lived to tell the tale.'
            }], function (err, result) {
                if (err) {
                    console.log('[db/init_test]: card insert many error.');
                    callback(err, {});
                } else {
                    if (result.insertedCount === 2) {
                        callback(false, result);
                    } else {
                        console.log('[db/init_test]: card insert count error');
                        callback(new Error('Insert Count Error'), {});
                    }
                }
            });
            
            let quesCol = client.db(dbName).collection('question');
            quesCol.insertMany([{
                questionId: 'q0',
                question: 'What\'s the weather today?',
                options: ['Fine!', 'Bad.', 'I don\'t know.'],
                answer: 0
            }, {
                questionId: 'q1',
                question: 'What\'s the weather tomorrow?',
                options: ['Fine!', 'Bad.', 'I don\'t know.'],
                answer: 1
            }], function (err, result) {
                if (err) {
                    console.log('[db/init_test]: question insert many error.');
                    callback(err, {});
                } else {
                    if (result.insertedCount === 2) {
                        callback(false, result);
                    } else {
                        console.log('[db/init_test]: question insert count error');
                        callback(new Error('Insert Count Error'), {});
                    }
                }
            });

            client.close();
        });
    },

    /**
     * get data from mongodb
     * @param type: 'user' or 'card'
     * @param id: userId or cardId
     * @param callback: callback(err, data)
     */
    get : function (type, id, callback) {
        if (!initiated) {
            console.log('[db/get]: database not initiated.');
            callback(new Error('Database Not Initiated.'), {});
            return;
        }
        if (type === 'user') {
            console.log('[db/get]: get user ' +id);
            // let data = {
            //     userId: id,
            //     name: 'aryon',
            //     stage: [['c0', 'c1', 'c2'],['c2', 'c3', 'c4']],
            //     pool: ['c0', 'c1', 'c2', 'c3', 'c4'],
            //     win: 1,
            //     all: 2
            // };
            MongoClient.connect(url, function (err, client) {
                let col = client.db(dbName).collection('user');

                // find document
                col.find({userId: id}).limit(1).toArray(function (err, items) {
                    if (err) {
                        console.log('[db/get]: ' + err.toString());
                        callback(err, {});
                    } else {
                        if (items.length === 0) {
                            callback(new Error('No Such User.'), {});
                            return;
                        }
                        let user = items[0];
                        callback(false, user);
                    }
                });
                client.close();
            });
        } else if (type === 'card') {
            console.log('[db/get]: get card ' +id);
            MongoClient.connect(url, function (err, client) {
                let col = client.db(dbName).collection('card');

                // find document
                col.find({cardId: id}).limit(1).toArray(function (err, items) {
                    if (err) {
                        console.log('[db/get]: ' + err.toString());
                        callback(err, {});
                    } else {
                        if (items.length === 0) {
                            callback(new Error('No Such Card.'), {});
                            return;
                        }
                        let user = items[0];
                        callback(false, user);
                    }
                });
                client.close();
            });
        } else if (type === 'question') {
            console.log('[db/get]: get question ' +id);
            // TODO:
            let data = {
                question: 'What\'s the weather today?',
                options: ['Fine', 'Bad', 'I don\'t know'],
                answer: 0
            };
            callback(false, data);
        } else {
            console.log('[db/get]: db type error');
            callback(new Error('db type error'), {});
        }
    },

    /**
     * update data
     * @param type
     * @param id
     * @param data
     * @param callback
     */
    update : function (type, id, data, callback) {
        MongoClient.connect(url, function (err, client) {
            if (type === 'user') {
                let col = client.db(dbName).collection('user');
                col.updateOne({userId: id}, {$set: data}, function (err, result) {
                    if (err) {
                        console.log('[db/update]: update user error.');
                        callback(err, {});
                    } else {
                        if (result.matchedCount === 1 && result.modifiedCount === 1) {
                            callback(false, result);
                        } else {
                            console.log('[db/update]: user update count error.');
                            callback(new Error('Update Count Error.'), {});
                        }
                    }
                });
            } else if (type === 'card') {
                let col = client.db(dbName).collection('card');
                col.updateOne({cardId: id}, {$set: data}, function (err, result) {
                    if (err) {
                        console.log('[db/update]: update card error.');
                        callback(err, {});
                    } else {
                        if (result.matchedCount === 1 && result.modifiedCount === 1) {
                            callback(false, result);
                        } else {
                            console.log('[db/update]: card update count error.');
                            callback(new Error('Update Count Error.'), {});
                        }
                    }
                });
            } else if (type === 'question') {
                let col = client.db(dbName).collection('question');
                col.updateOne({questionId: id}, {$set: data}, function (err, result) {
                    if (err) {
                        console.log('[db/update]: question update user error.');
                        callback(err, {});
                    } else {
                        if (result.matchedCount === 1 && result.modifiedCount === 1) {
                            callback(false, result);
                        } else {
                            console.log('[db/update]: question update count error.');
                            callback(new Error('Update Count Error.'), {});
                        }
                    }
                });
            } else {
                console.log('[db/update]: db type error');
                callback(new Error('db type error'), {});
            }
            client.close();
        });
    },
    del : function (type, id, callback) {
        MongoClient.connect(url, function (err, client) {
            if (type === 'user') {
                let col = client.db(dbName).collection('user');
                col.deleteOne({userId: id}, function (err, result) {
                    if (err) {
                        console.log('[db/del]: del user error.');
                        callback(err, {});
                    } else {
                        if (result.deletedCount === 1) {
                            callback(false, result);
                        } else {
                            console.log('[db/del]: user update count error.');
                            callback(new Error('Del Count Error.'), {});
                        }
                    }
                });
            } else if (type === 'card') {
                let col = client.db(dbName).collection('card');
                col.deleteOne({userId: id}, function (err, result) {
                    if (err) {
                        console.log('[db/del]: del card error.');
                        callback(err, {});
                    } else {
                        if (result.deletedCount === 1) {
                            callback(false, result);
                        } else {
                            console.log('[db/del]: card update count error.');
                            callback(new Error('Del Count Error.'), {});
                        }
                    }
                });
            } else if (type === 'question') {
                let col = client.db(dbName).collection('question');
                col.deleteOne({userId: id}, function (err, result) {
                    if (err) {
                        console.log('[db/del]: del question error.');
                        callback(err, {});
                    } else {
                        if (result.deletedCount === 1) {
                            callback(false, result);
                        } else {
                            console.log('[db/del]: question update count error.');
                            callback(new Error('Del Count Error.'), {});
                        }
                    }
                });
            } else {
                console.log('[db/del]: db type error');
                callback(new Error('db type error'), {});
            }
            client.close();
        });
    },

    /**
     * add data to db
     * @param type
     * @param id
     * @param data
     * @param callback
     */
    add : function (type, id, data, callback) {
        MongoClient.connect(url, function (err, client) {
            const col = client.db(dbName).collection(type);
            col.insertOne(data, function (err, result) {
                if (err) {
                    console.log('[db/add]: add to ' + type + ' error.');
                    callback(err, {});
                } else {
                    if (result.insertedCount !== 1) {
                        console.log('[db/add]: add to ' + type + ' Count error.');
                        callback(new Error('Add Count Error.'), {});
                    } else {
                        callback(false, result);
                    }
                }
            });
            client.close();
        });
    }
};