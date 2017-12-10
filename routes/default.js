/**
 * Created by web-01 on 2017/11/26.
 */

module.exports = function (app) {
    //引入默认页面
    app.get('/',(req,res)=>{
        res.render('index',{session:req.session});
    });
    //获取注册页
    app.get('/register',(req,res)=>{
        res.render('register',{err:req.flash('err'),succ:req.flash('succ'),session:req.session});
    })
    //获取登录页
    app.get('/login',(req,res)=>{
        res.render('login',{err:req.flash('err'),succ:req.flash('succ'),session:req.session});
    });
    //注销
    app.get('/logout',(req,res)=>{
        req.session.destroy();
        res.redirect('/');
    })

}