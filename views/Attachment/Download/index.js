var baseURL = `${apiDict['basic']}Attachment`
var axiosOwn = axios.create({ headers: { 'cool-token': window.token }, baseURL })
axiosOwn.interceptors.response.use(commonSuccess, commonError)
var vm = new Vue({
  el: '#root',
  methods: {
    download(){
      axiosOwn.get(baseURL, { params: { id } }).then(data => {
        if (data.base64 != null) {
          //如果是服务器判断是小文件，会直接base64传
          var blob = atob(data.base64)
          var ab = new ArrayBuffer(blob.length)
          var ia = new Uint8Array(ab)
          // set the bytes of the buffer to the correct values
          for (var i = 0; i < blob.length; i++) ia[i] = blob.charCodeAt(i)
          var file = new File([ab], data.name);
          window.saveAs(file);
        } else {
          //文件太大直接传会造成浏览器内存压力，改为外部链接，用流下载
          var url = `${baseURL}\\Download?key=${data.downloadKey}`
          var a = document.createElement('a')
          a.href = url
          a.setAttribute('download', 'download')
          a.innerText = '下载'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
      })
    }
  }
})

