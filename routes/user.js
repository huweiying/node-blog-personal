/**
 * Created by web-01 on 2017/11/26.
 */
//处理所有与用户有关的请求，
const bcrypt = require('bcryptjs');//加密模块
const db = require('../lib/db');//数据库模块
const path = require('path');//数据库模块
const avararType = /(png|jpg|gif|svg)/i;


module.exports = function(app){

    //提交注册信息
    app.post('/register',(req,res)=>{
        let username = req.body.username;
        let password = req.body.password;
        let salt = bcrypt.genSaltSync(10);//随机盐，提高密码安全性
        let encryptedPassword = bcrypt.hashSync(password,salt);
        let avatar = req.files.avatar;
        let fileName = 'default.svg';
        if(avatar) {
            let ext = path.extname(avatar.name);
            if(!avararType.test(ext)){
                req.flash('err','头像格式错误');
                return res.redirect('back');
            }else{
                fileName = Date.now() + ext;//重命名文件
                avatar.mv(path.join(__dirname, '../public/avatars/', fileName));
            }
        }

            //如果用户名存在，则不插入
            db.pool.query('SELECT * FROM user WHERE username = ?',[username],(err,result,fields)=>{
                if (err) throw err;
                if(result.length === 1){
                    req.flash('err','用户名已存在');
                    return res.redirect('back');//重定向back，请求注册页面
                }else{
                    db.pool.query('INSERT INTO user VALUE(null,?,?,?)',[username,encryptedPassword,fileName],(err,result,fields)=>{
                        if (err) throw err;
                        if(result.affectedRows === 1){
                            //注册成功
                            req.flash('succ','请登录');
                            return res.redirect('/login')
                        }else{
                            //注册失败
                            req.flash('err','注册失败');
                            return res.redirect('back')
                        }
                    });
                }
            });

    })
    //提交登录信息
    app.post('/login',(req,res)=>{
        let username = req.body.username;
        let password = req.body.password;
        db.pool.query('SELECT * FROM user WHERE username = ?',[username],(err,result,fields)=>{
                if(result.length === 1) {
                    //获得该用户加密的密码
                    let encryptedPassword = result[0].password;
                    //比较两次密码是否一致
                    if (bcrypt.compareSync(password, encryptedPassword)) {
                        req.session.username = result[0].username;
                        req.session.userId = result[0].id;
                        req.session.avatar = result[0].avatar;
                        console.log(req.session.avatar);
                        return res.redirect('/blog/'+username);
                    } else {
                        req.flash('err','用户名或密码非法');
                        return res.redirect('back')
                    }
                } else {
                    req.flash('err','用户名或密码非法');
                    res.redirect('back')
                }

            })
    })
    //注销
    app.get('/logout',(req,res)=>{
        req.session.destroy();
        res.redirect('/');//重定向
    })
}