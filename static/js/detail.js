localStorage.setItem('isOpen', true)

window.addEventListener('beforeunload', function(){
  localStorage.removeItem('isOpen')
})


window.onload = function(){
  updateView()


  //清空列表
  document.querySelector('.clearlist-btn').onclick = function(){
    localStorage.removeItem('musicData')
    updateView()
  }


  //清空勾选项
  document.querySelector('.delete-btn').onclick = function(){
    let inputs = document.querySelectorAll('.songlist-item input')
    let musicData = JSON.parse(localStorage.getItem('musicData'))
    inputs.forEach((v,k) => {
      v.checked ? musicData.splice(k,1): ''
    })
    localStorage.setItem('musicData', JSON.stringify(musicData))
    updateView()
  }
}

window.addEventListener('storage', function(){
  updateView()
})

function updateView(){
  let musicData = localStorage.getItem('musicData')
  let innerContent = `
    <li class="title">
      <input type="checkbox" name="" id="">
      <span>歌曲</span>
      <span>歌手</span>
      <span>时长</span>
    </li>
  `

  if (musicData) {
    musicData = JSON.parse(musicData)
    musicData.forEach(music => {
      let str = `
      <li class="songlist-item">
        <input type="checkbox" name="" id="">
        <span>${music.songName}</span>
        <span>${music.singer}</span>
        <span>${music.time}</span>
      </li>
      `

      innerContent += str
    })
  }


  document.querySelector('.list').innerHTML = innerContent
}