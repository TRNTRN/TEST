var connection = require('../config/connectDB');
var crypto = require('crypto');

connection.connect(function(err) {
    if (err) {
        console.log('[query] - :' + err);
        return;
    }
    console.log('database connection succeed!');
});

//sort by recent project
exports.sortByRecent = function(callback) {
    var sql = "SELECT * FROM ilance_users i1 INNER JOIN ilance_projects i2 ON i1.user_id=i2.user_id LEFT JOIN ilance_categories i3 ON i2.cid=i3.cid ORDER BY i2.date_added DESC";
    connection.query(sql, function(err, data, fields) {
        if (err) {
            return callback(err)
        }
        callback(null, data);
    });
}

//sort by project title
exports.sortByprojectTitle = function(callback) {
    var sql = "SELECT * FROM ilance_users i1 INNER JOIN ilance_projects i2 ON i1.user_id=i2.user_id LEFT JOIN ilance_categories i3 ON i2.cid=i3.cid ORDER BY i2.project_title";
    connection.query(sql, function(err, data, fields) {
        if (err) {
            return callback(err)
        }
        callback(null, data);
    });
}

//sort by categoty
exports.sortBycategory = function(callback) {
    var sql = "SELECT * FROM ilance_users i1 INNER JOIN ilance_projects i2 ON i1.user_id=i2.user_id LEFT JOIN ilance_categories i3 ON i2.cid=i3.cid ORDER BY i3.cname";
    connection.query(sql, function(err, data, fields) {
        if (err) {
            return callback(err)
        }
        callback(null, data);
    });
}

//sort by username
exports.sortByusername = function(callback) {
    var sql = "SELECT * FROM ilance_users i1 INNER JOIN ilance_projects i2 ON i1.user_id=i2.user_id LEFT JOIN ilance_categories i3 ON i2.cid=i3.cid ORDER BY i1.username";
    connection.query(sql, function(err, data, fields) {
        if (err) {
            return callback(err)
        }
        callback(null, data);
    });
}

//new user register
exports.createUser = function(user) {
    return new Promise(function(resolve, reject){
        var sql = "SELECT * FROM ilance_users";
        connection.query(sql, function(err, data, fields) {
            if (err) {
                return reject(err)
            } else {
                //check whether this username has been used
                for (var i = 0; i < Object.keys(data).length; i++) {
                    if (data[i].username == user.username) {
                        return reject(err)
                    }
                }
                var id = Object.keys(data).length + 1;
                var saltObj = saltHashPassword(user.password);
                var saltPassword = saltObj.passwordHash;
                var salt = saltObj.salt;
                var insert = "INSERT INTO ilance_users (user_id, username, password, salt, email) VALUES ('"+id+"','"+user.username+"','"+saltPassword+"','"+salt+"','"+user.email+"')";
                connection.query(insert, function(err, data, fields) {
                    if (err) {
                        console.log('lost to create user')
                        return reject(err)
                    } else {
                        resolve("success")
                    }
                })
            }
        })
    })  
}

//verify user when log in
exports.verifyUser = function(user) {
    return new Promise(function(resolve, reject) {
        var sql = "SELECT password, salt FROM ilance_users WHERE username='"+ user.username+"'";
        connection.query(sql, function(err, data, fields) {
            if (err) {
                return reject(err)
            }
            if (Object.keys(data).length != 0) {
                var saltPassword = sha512(user.password, data[0].salt);
                //password's length in the database is 32
                var password = saltPassword.passwordHash.substring(0, 32);
                if(data[0].password == password) {
                   resolve("success")
                } 
                else {
                    reject("fail");
                }
            } else {
                reject("fail");
            }
        })
    })
}

//functions for salt hash the password
var genRandomString = function(length) {
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex')
        .slice(0,length);
}

var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    var salt = genRandomString(5); /** Gives us salt */
    var passwordData = sha512(userpassword, salt);
    return passwordData;
}