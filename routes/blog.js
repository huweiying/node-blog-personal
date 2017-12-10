/**
 * Created by web-01 on 2017/12/3.
 */

const db = require('../lib/db');

module.exports = function (app) {
    app.get('/blog/:username', (req, res) => {
        let sql = `
        SELECT 
            p.*, 
            u.id AS userId,
            u.username,
            u.avatar
        FROM 
            blog.post p
        RIGHT OUTER JOIN
            blog.user u
        ON
            p.userId = u.id
        WHERE
            u.id = ?
        ORDER BY id DESC   
        `;

        db.pool.query(sql, [req.session.userId], (err, results, fields) => {
            if (err) throw err;
            res.render('blog', {
                session: req.session,
                posts: results
            });
        });
    });
};