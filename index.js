const Koa = require('koa')
const Router = require('koa-router')
const static = require('koa-static')
const views = require('koa-views')
const bodyParser = require('koa-bodyparser')
const md5 = require('md5')

const musicData = require('./data/music.json')

const app = new Koa()
app.use(static(__dirname+"/static"))
app.use(views(__dirname+"/views"), {
  map: {
    html: "pug"
  }
})
app.use(bodyParser())

const router = new Router()
//登陆页面
router.get('/login', async ctx => {
  //登录了————有cookie
  let loginInfo = ctx.cookies.get("isLogin")
  if(loginInfo){
    if(loginInfo===md5("admin"+"123")){
      ctx.redirect('/list')
    }
  }
  await ctx.render("login.pug")
})
//登录
router.post('/checkUser', ctx => {
  //用户名密码正缺： admin 123
  let {username, pwd, rememberMe} = ctx.request.body
  if(username==="admin" && pwd==="123"){
    //点击了记住我选项————需要储存————cookies
    if(rememberMe){
      ctx.cookies.set("isLogin", md5(username+pwd), {
        maxAge: 3600*1000*24
      })
    }
    //正确跳到list
    ctx.redirect('/list')
  }else{
    //不正确error
    ctx.redirect('/error')
  }
})

//list
router.get('/list', async ctx => {
  await ctx.render("list.pug", {
    musicData
  })
})
//error
router.get('/error', async ctx =>{
  await ctx.render("error.pug")
})


//detail
router.get('/detail', async ctx => {
  await ctx.render('detail.pug')
})

app.use(router.routes())

app.listen(3000)
