window.onload = function(){
  let colors = ["#fff","#83f1e0", "#e3f551", "#e79db0"]
  let key = 0
  /* if(getCookie("colorKey")){
    key = getCookie("colorKey")
    document.body.style.backgroundColor = colors[key]
  } */
  if(localStorage.getItem('colorKey')){
    key = localStorage.getItem('colorKey')
    document.body.style.backgroundColor = colors[key]
  }
  document.querySelector('.changeColor').onclick = function(){
    key++
    key = key>3?0:key
    /* setCookies("colorKey", key, {
      "Max-Age":3600*24
    }) */
    localStorage.setItem("colorKey", key)
    document.body.style.backgroundColor = colors[key]
  }




  //鼠标移动上去显示播放以及添加按钮
  let btnsArr = document.querySelectorAll('.songs .btns')
  let trs = document.querySelectorAll('tr')
  trs = Array.from(trs).splice(1)
  trs.forEach((v,k) => {
    v.onmouseover = function(){
      btnsArr.forEach((btns, key) => {
        if(key === k){
          btnsArr[k].style.display = "block"
        }else{
          btns.style.display = "none"
        }
      })
    }
  })



  //点击播放或者add
  /* document.querySelectorAll('.play-btn').onclick = showDetail
  document.querySelectorAll('.add-btn').onclick = showDetail */
}


/* function setCookies(name, value, options={}){
  let cookieData = `${name}=${value};`
  for(let key in options){
    let str = `${key}=${options[key]};`
    cookieData+=str
  }

  document.cookie = cookieData
}


function getCookie(name){
  let arr = document.cookie.split('; ')
  for(let i = 0; i < arr.length; i++){
    let arr2 = arr[i].split('=')
    if(arr2[0] === name){
      return arr2[1]
    }
  }
  return ""
} */



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