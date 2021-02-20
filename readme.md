#### 后台搭建

1. yarn add koa koa-router koa-static koa-views koa-bodyParser pug -S

2. index.js——后台

   ```
   const Koa = require('koa')
   const Router = require('koa-router')
   const static = require('koa-static')
   const views = require('koa-views')
   const bodyParser = require('koa-bodyparser')
   
   const app = new Koa()
   app.use(static(__dirname+"/static"))
   app.use(views(__dirname+"/views"), {
     map: {
       html: "pug"
     }
   })
   app.use(bodyParser())
   
   const router = new Router()
   app.use(router.routes())
   
   app.listen(3000)
   ```

   

3. 前端使用pug模板，这是demo小练习，与后端同源。

   准备了4个页面，放在views文件夹中，需要用到的样式，js以及相关img文件放在static文件夹中

   使用到的json数据放在data文件夹中

#### 前端

 1. 页面已经准备好，其中page中是初始的html文件，使用html-pug转化器转为pug文件放入views。

 2. 登录： 使用form表单，填写正确的用户名密码登录，表单中设有“记住我”表单项，勾选后即可自动登录。

    ```
    <form action="/checkUser" method="POST">
    	姓名：<input class="inputStyle" type="text" name="username" /><br />
    	密码：<input class="inputStyle" type="password" name="pwd" /><br />
    	<input class="loginStyle" type="submit" value="登录" /> |
    	<input class="remember" type="checkbox" name="rememberMe" /><span>记住我</span>
    </form>
    ```

3. list页面： 登录后跳转list页面，list页面中数据由后台提供的json数ju渲染后提供的动态数据，在页面中以table格式呈现，鼠标hover后显示出隐藏的播放以及添加按钮。

   页面“换肤”按钮点击后可以切换页面背景色（由js实现：点击按钮后可以切换成提供的颜色数组中的背景色）

4. detail页面： 点击list中的播放或者添加按钮后，跳转到detail页面。如果detail页面已经出现，再次点击任何播放或者添加按钮也不会再次跳出新detail页面。（localstorage）

   每次播放或者添加不同歌曲，detail页面中歌曲列表随之改变，如果删除，detail页面也会变换。

#### 一些记录

##### 1. 实现自动登录：cookies（每次到后端的请求中自动携带)	

```
router.post('/checkUser', ctx => {
  //正确的用户名密码： admin 123
  let {username, pwd, rememberMe} = ctx.request.body
  if(username==="admin" && pwd==="123"){
    if(rememberMe){
    //"记住我"
      ctx.cookies.set("isLogin", md5(username+pwd), {
        maxAge: 3600*1000*24
      })
    }
    //正确
    ctx.redirect('/list')
  }else{
    //不正确error
    ctx.redirect('/error')
  }
})
```

<u>设置了cookies就可以每次登录时进行验证是否有cookies,有并且验证正确就不需要再输入用户名密码，直接跳到list页面</u>

```
router.get('/login', async ctx => {
  //有cookie
  let loginInfo = ctx.cookies.get("isLogin")
  if(loginInfo){
    if(loginInfo===md5("admin"+"123")){
      ctx.redirect('/list')
    }
  }
  await ctx.render("login.pug")
})

```

##### 2. list页面数据的渲染

<u>注意： list页面的渲染需要列表数据——来自于json， 后台直接在render时带上了musicData</u>

```
router.get('/list', async ctx => {
  await ctx.render("list.pug", {
    musicData
  })
})
```

此时，在前端可以直接拿到数据并且渲染（循环遍历）

```
        each val,key in musicData
          tr
            td #{key+1}
            td 
              |#{val.songName} 
              .btns
                button.play-btn(onclick='showDetail('+JSON.stringify(val)+')')
                button.add-btn(onclick='showDetail('+JSON.stringify(val)+')')
            td #{val.album}
            td #{val.time}
```

##### 3. 换肤

换肤点击后背景色变换，并且在下一次打开是变化后的颜色，这需要存储相关信息。但是这操作和后端关系不大，不需要cookies, 用localstorage即可

```
window.onload = function(){
  let colors = ["#fff","#83f1e0", "#e3f551", "#e79db0"]
  let key = 0

	//如果有存储过，一打开页面/刷新后 就用变化后的（存储的）颜色
  if(localStorage.getItem('colorKey')){
    key = localStorage.getItem('colorKey')
    document.body.style.backgroundColor = colors[key]
  }
  
  document.querySelector('.changeColor').onclick = function(){
    key++
    key = key>3?0:key
	
	//存储改变后的颜色信息
    localStorage.setItem("colorKey", key)
    document.body.style.backgroundColor = colors[key]
  }
```

##### 4. detail相关变化的实现——localstorage + pug页面的函数传参

没有点击打开detail页面时，一点击list击list页面的相关歌曲的播放或者添加， detail打开，打开后多点击不会开新页面（localstorage存储下页面的打开的关闭情况 ）

点list击list页面的相关歌曲的播放或者添加，歌曲信息就会传递给detail（需要点击时传参）

点击不同歌曲的播放或者添加， 或者detail页面的删除/清空操作，detail页面歌曲列表变，并且重新打开也是如此（localstorage存储操作过的musicData列表）

**点击时传参**

```
button.play-btn(onclick='showDetail('+JSON.stringify(val)+')')
button.add-btn(onclick='showDetail('+JSON.stringify(val)+')')
```

配合js（**localstorage存储**）

```
function showDetail(data){
  if(localStorage.getItem('musicData')){
    let musicData = JSON.parse(localStorage.getItem('musicData'))
    let flag = musicData.some(music => music.id == data.id)
    if(!flag){
      musicData.push(data)
    }
    localStorage.setItem('musicData', JSON.stringify(musicData))
  }else{
    localStorage.setItem('musicData', JSON.stringify([data]))
  }


  if(localStorage.getItem('isOpen')){
    return
  }else{
    window.open('/detail')
  }
}
```

