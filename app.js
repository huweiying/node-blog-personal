/**
 * Created by web-01 on 2017/11/26.
 */
const express = require('express');//服务器
const bodyParser = require('body-parser');//获取输入数据
const ejs = require('ejs');//模板字符串
const session = require('express-session');//引入会话存储

let app = express();

// 使用中间件
app.use(bodyParser.urlencoded({extended:true}));
app.engine('.html',ejs.__express);//配置模板引擎
app.set('view engine','html');
app.use(session({
    secret:'blog',
    resave:true,
    saveUninitialized:false
}));

require('./routes/default')(app);
require('./routes/user')(app);

app.listen(8080);
