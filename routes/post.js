/**
 * Created by web-01 on 2017/12/3.
 */
const db = require('../lib/db');

module.exports = function (app) {
    app.get('/post', (req, res) => {
        res.render('post', {
            session: req.session,
            success: req.flash('success'),
            error: req.flash('error')
        });
    });

    app.post('/post/create', (req, res) => {
        let title = req.body.title;
        let content = req.body.content;
        let userId = req.session.userId;
        let sql = 'INSERT INTO blog.post(title, content, userId)  VALUE(?, ?, ?)';
        db.pool.query(sql, [title, content, userId], (err, results, fileds) => {
            if (err) throw err;
            if (results.affectedRows === 1) {
                res.redirect('/blog/' + req.session.username);
            } else {
                req.flash('error', 'Publish failed.');
                res.redirect('back');
            }
        });
    });

    // app.get('/post/:postId',(req,res)=>{
    //     // let postId = req.
    // })
};