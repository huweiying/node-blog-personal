/**
 * Created by web-01 on 2017/11/26.
 */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');

let app = express();
let pool = mysql.createPool({
    database : 'blog',
    user : 'root'
})
// 使用中间件
app.use(bodyParser.urlencoded({extended:true}));
//引入默认页面
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'views/default.html'));
});
//获取注册页
app.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname,'views/register.html'));
})
//获取登录页
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'views/login.html'));
});
//提交注册信息
app.post('/register',(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    pool.getConnection((err,conn)=>{
        if (err) throw err;
        //如果用户名存在，则不插入
        conn.query('SELECT * FROM user WHERE username = ?',[username],(err,result,fields)=>{
            if (err) throw err;
            if(result.length === 1){
                res.sendFile(path.join(__dirname,'views/register.html'));
            }else{
                console.log(result.length);
                conn.query('INSERT INTO user VALUE(null,?,?)',[username,password],(err,result,fields)=>{
                    if (err) throw err;
                    if(result.affectedRows === 1){
                        //注册成功
                        res.sendFile(path.join(__dirname,'views/login.html'));
                    }else{
                        //注册失败
                        res.sendFile(path.join(__dirname,'views/register.html'));
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
        conn.query('SELECT * FROM user WHERE username = ? AND password = ?',[username,password],(err,result,fields)=>{
            if(result.length === 1){
                res.sendFile(path.join(__dirname,'views/default.html'));
            }else{
                res.sendFile(path.join(__dirname,'views/login.html'));
            }
        })
        conn.release();
    })
})

app.listen(8080);
