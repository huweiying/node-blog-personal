/**
 * Created by web-01 on 2017/11/26.
 */
const mysql = require('mysql');

let pool = mysql.createPool({
    database : 'blog',
    user : 'root'
});

module.exports = function (app) {
    app.post('/article/create',(req,res)=>{
        let title = req.body.title;
        let content = req.body.content;
        let photo = null;
        let userId = req.session.userId;
        pool.getConnection((err,conn)=>{
            if (err) throw err;
            conn.query('INSERT INTO article(title,content,photo,userId) VALUE(?,?,?,?)',[title,content,photo,userId],(err,results,fields)=>{
                if (err) throw err;
                if(results.affectedRows === 1){
                    res.render('/article/list',{});
                }else{
                    res.render('index',{session:req.session,msg:'error'});
                }
            })
            conn.release();
        })
    })
    app.get('/article/list',(req,res)=>{
        let userId = req.session.userId;
        pool.getConnection((err,conn)=>{
            if (err) throw err;
            conn.query('SELECT * FROM article WHERE userId = ?',[userId],(err,results,fields)=>{
                if (err) throw err;
                res.render('index',{session: req.session, articles: results, msg: 'published.'})

            })
        })

    })
}