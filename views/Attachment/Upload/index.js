var parentId = window.location.hash.split('#')[2]
parentId = parseInt(Math.random() * 10000).toString() //测试用
var parentType = window.location.hash.split('#')[3]
parentType = '测试' //测试用
var baseURL = `${apiDict['basic']}Attachment`
var axiosOwn = axios.create({ headers: { 'cool-token': window.token }, baseURL })
axiosOwn.interceptors.response.use(commonSuccess, commonError)
if (parentType == undefined || parentId == undefined) Vue.prototype.$alert('非法请求')
else
  var vm = new Vue({
    el: '#root',
    data: {
      action: baseURL,
      headers: { 'cool-token': window.token },
      data: {},
    },
    methods: {
      handleChange(_, fileList) {
        if (fileList.length > 1) fileList.splice(0, 1)
      },
      getNewItem() {
        axiosOwn.get('NewItem').then(
          data =>
            (this.data = Object.assign(data, {
              parentType: decodeURIComponent(parentType),
              parentID: decodeURIComponent(parentId),
            }))
        )
      },
      handleSuccess(response){
        //不经过axios，response处理得写一遍
        //例如 if(response.state!='success') return
        var attachmentId = response.rows[0].id
        //todo: 正常post单据附件，附带attachmentId，如果封装成组件，应该emit
        //todo: 删除单据附件时，应先用这个id get attachment，获取到模型，再发delete请求
        //讨论：是不是把ts也保存起来，这样就可以直接delete不用先get呢？
      },
      save(){
        this.$refs.upload.submit()
        //关闭弹窗别让有机会再选择文件和上传。。。
      }
    },
    created() {
      this.getNewItem()
    },
  })
