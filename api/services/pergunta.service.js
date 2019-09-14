﻿var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('users');

var service = {};

service.authenticate = authenticate;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service; 

function getById(_id) {
    var deferred = Q.defer();

    db.users.findById(_id, function (err, perg) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (perg) {
            // return user (without hashed password)
            deferred.resolve(_.omit(perg, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(pergParam) {
    var deferred = Q.defer();

    // validation
    db.users.findOne(
        { pergID: pergParam.pergID },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // username already exists
                deferred.reject('Pergunta "' + pergParam.pergID + '" já está cadastrada!');
            } else {
                createPerg();
            }
        });

    function createPerg() {

        db.users.insert(
            perg,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, pergParam) {
    var deferred = Q.defer();

    // validation
    db.users.findById(_id, function (err, perg) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (perg.pergID !== pergParam.pergID) {
            // username has changed so check if the new username is already taken
            db.users.findOne(
                { pergID: pergParam.pergID },
                function (err, perg) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (perg) {
                        // username already exists
                        deferred.reject('Pergunta "' + req.body.username + '" já está cadastrada!')
                    } else {
                        updatePerg();
                    }
                });
        } else {
            updatePerg();
        }
    });

    function updatePerg() {
        // fields to update
        var set = {
            pergDescr: pergParam.pergDescr
        };

        // update password if it was entered
        if (pergParam.password) {
            set.hash = bcrypt.hashSync(pergParam.password, 10);
        }

        db.users.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.users.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}