var resourceName = 'TypeofMaterial'//资源名称 模板生成
var apiName = JSON.parse(window.coolLocals['index.json'])['apiName']
window.vm = new Vue({
  el: '#root',
  data: {
    // uniqueDeployKeyURL为前端已定义的变量 面的EmployeeInfo为后端模板生成的文件变量名 后面的为固定格式 需模板生成
     uniqueDeployKey:{
      api: apiDict[apiName] + resourceName
     },
     // axiosSetting 固定格式 需模板生成生成
     axiosSetting:{
        baseURL:apiDict[apiName],
      },
      // cool-single-dialog组件的json文件名以及它的api名称 uniqueKeyURL为前端已定义的变量 后面的EmployeeInfo为后端模板生成的文件变量名
     isMethods:{
      isGetCondition:false,
      isTableSelectionChange:false,
     },
     showModeList:true,

      // 弹出框 固定格式 里面的值可按以下定义 需模板生成
     dialogs: [{
          top: '5vh',
          name: 'dialog',
          visible: false,
          collapse: false,
          width: '90%',
          title: '',
          src: '',
        }
      ],
      // newItem
     newItemURL: apiDict[apiName] + resourceName +'/newItem',
     //cool-single-dialog 
     uniqueKey: apiDict[apiName] + resourceName,
     // 是否显示cool-single-dialog组件 默认值固定为false 需模板生成
     dialogVisible:false,
     isDialogMethods:{
      isUpdateForm:false,
      isSaveEvent:false,
     },
     treeData:[],
      defaultProps: {
      children: 'children',
      label: 'name'
    },
     menuDialogVisible:false,
     parentId:null,
     newItemData:null,
     formItemsData:null,
     isEdit:false,
     dialogTitle:"",
     formItems:{
      form: [
      {
        "type": "select",
        "options":[],
        "value": "",
        "label": "上级名称",
        "name": "parentID",
        "disabled":false,
        "style": {
          "width": "100%"
        },
        "inputStyle":{
          "width":"178px"
        }
      },
      {
        "type": "input",
        "value": "",
        "label": "名称",
        "name": "name",
        "style": {
          "width": "100%"
        },
        "inputStyle":{
          "width":"178px"
        }
      },
      {
        "type": "input",
        "value": "",
        "label": "类型描述",
        "name": "description",
        "style": {
          "width": "100%"
        },
        "inputStyle":{
          "width":"178px"
        }
      } ,
      {
        "type": "input",
        "value": "",
        "label": "备注",
        "name": "remark",
        "style": {
          "width": "100%"
        },
        "inputStyle":{
          "width":"178px"
        }
      }
    ]
     }      
     
  },
  mounted() {
    // 固定格式 需模板生成
    this.$el.style.visibility = 'visible'
  },
  watch:{
    dialogTitle(arg){
      console.log(arg,arg == '编辑物料类型')
        this.formItems.form[0].disabled = arg == '编辑物料类型' 
    }
  },
  methods: {
    getOptionsData(){
      axiosDict[apiName].get('TypeofMaterial/GetLargeType').then(res=>{
        console.log(res)
        if(res){
          this.formItems.form[0].options = []
           res.map(item=>{
            this.formItems.form[0].options.push({value:item.id,label:item.name,})
          })
        }
      })     
    },
    backEvent(){
      this.dialogVisible = false
      this.$refs.ruleForm.resetForm()
      this.$refs.ruleForm.clearForm()
    },
    customEdit(){
      this.isEdit = true
      this.dialogTitle = '编辑物料类型'     
      //将选中编辑数据映射到表单
         let i 
         this.formItems.form.forEach(item=>{
           for( i  in this.selectionData[0]){
            if(i == item.name){
              item.value = this.selectionData[0][i]
            }
           }
         }) 
      this.dialogVisible = true
    },
    customNew(){
      this.getOptionsData()
      this.dialogTitle = '新建物料类型'
      axiosDict[apiName].get(this.newItemURL).then(res=>{
        console.log(res)
        this.newItemData  = res
      })
      this.isEdit = false
      this.dialogVisible =true
    },
    getForm(arg){
      console.log(arg)
      this.formItemsData = arg
    },
    saveEvent(arg){
           if(this.$refs.ruleForm.validateForm()){
        // 判断编辑还是新建
          this.isEdit ? this.formItemsData = Object.assign(this.selectionData[0],this.formItemsData) : this.formItemsData = Object.assign(this.newItemData,this.formItemsData)
          console.log(this.formItemsData)
          if(this.isEdit) {
            axiosDict[apiName].put(this.uniqueKey,this.formItemsData).then(res=>{
            console.log(res)
            if(res){
              this.$refs.treeView.nrormalQuery()
              // 编辑 根据当前数据的id 在表格数据中找到它所在的索引 然后将编辑好的数据替换
            //   let currentDataIndex =  this.tableData.findIndex(item=>{
            //   return  item.id == res.id
            // })
            // console.log(currentDataIndex)
            // this.tableData[currentDataIndex] = Object.assign( this.tableData[currentDataIndex],res)
            this.backEvent()
            }
            this.formItemsData = null
          })
          }else{
            axiosDict[apiName].post(this.uniqueKey,this.formItemsData).then(res=>{
            console.log(res)
            if(this.isEdit == false && res){
                // this.tableData.unshift(res)
                this.$refs.treeView.nrormalQuery()
                this.backEvent()
           }else{}
            this.formItemsData = null
          })
          }
        }
        },
      //cool-single-view 
      tableRowClick(arg){
      
      },
      tableRowDblclick(arg){
    
      },
      tableSelectionChange(arg){
        if(arg.length != 0)this.selectionData = arg
          
      },  
      paginationSizeChange(arg){

      },
      paginationCurrentChange(arg){

      },
      getCondition(arg){

      },
      // cool-single-dialog
      updateForm(arg){

      }
  }
})