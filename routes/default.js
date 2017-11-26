/**
 * Created by web-01 on 2017/11/26.
 */

module.exports = function (app) {
    //引入默认页面
    app.get('/',(req,res)=>{
        // res.sendFile(path.join(__dirname,'views/default.html'));
        res.render('default',{});
    });
    //获取注册页
    app.get('/register',(req,res)=>{
        // res.sendFile(path.join(__dirname,'views/register.html'));
        res.render('register',{msg:null});
    })
    //获取登录页
    app.get('/login',(req,res)=>{
        // res.sendFile(path.join(__dirname,'views/login.html'));
        res.render('login',{msg:null});
    });
}