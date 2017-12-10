/**
 * Created by web-01 on 2017/11/26.
 */

const mysql = require('mysql');

module.exports.pool = mysql.createPool({
    database : 'blog',
    user: 'root',
    dateStrings:'date'
});