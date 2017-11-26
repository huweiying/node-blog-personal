/**
 * Created by web-01 on 2017/11/26.
 */
//处理所有与用户有关的请求，
const bcrypt = require('bcryptjs');//加密模块
const mysql = require('mysql');//数据库模块

let pool = mysql.createPool({
    database : 'blog',
    user : 'root'
})

module.exports = function(app){

    //提交注册信息
    app.post('/register',(req,res)=>{
        let username = req.body.username;
        let password = req.body.password;
        let salt = bcrypt.genSaltSync(10);//随机盐，提高密码安全性
        let encryptedPassword = bcrypt.hashSync(password,salt);
        pool.getConnection((err,conn)=>{
            if (err) throw err;
            //如果用户名存在，则不插入
            conn.query('SELECT * FROM user WHERE username = ?',[username],(err,result,fields)=>{
                if (err) throw err;
                if(result.length === 1){
                    // res.sendFile(path.join(__dirname,'views/register.html'));
                    res.render('register',{msg:'用户名已存在'});
                }else{
                    conn.query('INSERT INTO user VALUE(null,?,?)',[username,encryptedPassword],(err,result,fields)=>{
                        if (err) throw err;
                        if(result.affectedRows === 1){
                            //注册成功
                            // res.sendFile(path.join(__dirname,'views/login.html'));
                            res.render('login',{msg:null});
                        }else{
                            //注册失败
                            // res.sendFile(path.join(__dirname,'views/register.html'));
                            res.render('register',{msg:'注册失败'});
                        }
                    });
                }
            });
            conn.release();
        })

    })
//提交登录信息
    app.post('/login',(req,res)=>{
        let username = req.body.username;
        let password = req.body.password;
        pool.getConnection((err,conn)=>{
            if (err) throw err;
            conn.query('SELECT * FROM user WHERE username = ?',[username],(err,result,fields)=>{
                if(result.length === 1) {
                    //获得该用户加密的密码
                    let encryptedPassword = result[0].password;
                    //比较两次密码是否一致
                    if (bcrypt.compareSync(password, encryptedPassword)) {
                        // res.sendFile(path.join(__dirname, 'views/default.html'));
                        req.session.username = username;
                        let userId = result[0].id;
                        req.session.userId = userId;
                        res.render('index',{session:req.session});
                    } else {
                        // res.sendFile(path.join(__dirname, 'views/login.html'));
                        res.render('login',{msg:'用户名或密码错误'});
                    }
                } else {
                    // res.sendFile(path.join(__dirname, 'views/login.html'));
                    res.render('login',{msg:'用户名或密码错误'});
                }

            })
            conn.release();
        })
    })
}