"use strict";
exports.__esModule = true;
exports.login = exports.newUser = exports.validateUsername = exports.createLoginTables = void 0;
var crypto = require("crypto");
function createLoginTables(db) {
    return new Promise(function (res, rej) {
        db.all("SELECT COUNT(*) AS cnt FROM sqlite_master WHERE type='table' AND name = 'users';", function (err, rows) {
            if (err) {
                rej('DB Error');
                return;
            }
            if (rows[0].cnt === 1) {
                console.log('User table exists.');
                res();
                return;
            }
            db.run("\n        CREATE TABLE users (\n          id INTEGER PRIMARY KEY,\n          username TEXT,\n          hashed_pass TEXT\n        )\n        ", [], function (err) {
                if (err) {
                    rej('DB Error');
                    return;
                }
                usersInit(db);
                res();
            });
        });
    });
}
exports.createLoginTables = createLoginTables;
function validateUsername(username) {
    return !!username.match(/^[0-9a-zA-Z]+$/);
}
exports.validateUsername = validateUsername;
function hashPassword(password) {
    return crypto.createHash('sha1').update(password).digest('hex');
}
function newUser(db, username, password) {
    return new Promise(function (res, rej) {
        if (!validateUsername(username)) {
            res(false);
            return;
        }
        var hashed = hashPassword(password);
        db.get("SELECT 1 as one FROM 'users' WHERE username = ?", [username], function (err, row) {
            if (row || err) { // konto już istnieje
                res(false);
                return;
            }
            db.run("INSERT INTO users (username, hashed_pass) VALUES(?,?)", [username, hashed], function (err) {
                res(!err);
            });
        });
    });
}
exports.newUser = newUser;
function login(db, username, password) {
    return new Promise(function (res, rej) {
        if (!validateUsername(username)) {
            res(false);
            return;
        }
        var hashed = hashPassword(password);
        db.get("SELECT 1 as one FROM 'users' WHERE username = ? AND hashed_pass = ?", [username, hashed], function (err, row) {
            res(!err && !!row);
        });
    });
}
exports.login = login;
function usersInit(db) {
    newUser(db, "admin", "admin");
    newUser(db, "user", "user");
}
