var resourceName = 'Employee'//资源名称 模板生成
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
      isTableRowClick:true,
      isTableSelectionChange:false,
      isPaginationSizeChange:true,
      isPaginationCurrentChange:true
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

     //cool-single-dialog 
     uniqueKey: apiDict[apiName] + resourceName,
     // 是否显示cool-single-dialog组件 默认值固定为false 需模板生成
     dialogVisible:false,
     isDialogMethods:{
      isUpdateForm:false,
      isSaveEvent:false,
     },      
      // 以下变量为前端自定义 无需生成
      codeVisible:false,
      inviteCode:null,
      userId:null,
      dialogTitle:"员工管理",
     editDialogTitle:"银行账户管理",
     editDialogVisible:false,
     justDialogWidth:'900px',
     editDialogWidth:"400px",
     showSaveButton:true,      
     formItems:{},
     dtlButtons:[],
     attaButtons:[],
     bankData:[],
     attachmentData:[],
     bankColumns:[],
     attaColumns:[],
     customerNewItem:{},
     bankNewItem:{},
     bankFormItems:{},
     editFormItems:{},
     isEdit:false,
     isDtlEdit:false,
     formItemsData:null,
     isSaveDisabled:false,
     currentData:null,
     selectionData:[],
     editFormItemsData:null,
     currentNewData:null,
     tableHeigh:'250px',
     uploadDialogVisible: false,
     parentId: undefined,
     parentType: '员工',
     nation:[]
  },
  mounted() {
    // 固定格式 需模板生成
    this.$el.style.visibility = 'visible'
    for (let i in window.coolLocals) {
      for (let p in JSON.parse(window.coolLocals[i])) {
        this[p] = JSON.parse(window.coolLocals[i])[p]
        if(p == 'dtlTableData'){
          this.bankColumns = JSON.parse(window.coolLocals[i])[p][0].columns
          this.attaColumns = JSON.parse(window.coolLocals[i])[p][1].columns
        }
        if(p == "nation") this.nation =JSON.parse(window.coolLocals[i])[p]
      }
    }
   this.formItems.form.find(p=>p.name == 'nation').options = this.nation
    // 获取性别数据
    axiosDict[apiName].get('BaseProperty/GetList?condition=[{%22FieldName%22:%22Type%22,%22TableName%22:%22[BaseProperty]%22,%22Value%22:[{%22value%22:%22%E6%80%A7%E5%88%AB%22}],%22TableRelationMode%22:%22AND%22,%22Mode%22:%22%E7%AD%89%E4%BA%8E%22,%22DataType%22:%22string%22}]').then(res=>{
      console.log(res)
      if(res)this.formItems.form.find(p=>p.name == 'sex').options = res.map(item=>{ return {value:item.name,label:item.name} })
    })
    // 获取部门数据
    axiosDict[apiName].get('Department/GetList?condition=[]').then(res=>{
      console.log(res)
      if(res)this.formItems.form.find(p=>p.name == 'departmentID').options = res.map(item=>{ return {value:item.id,label:item.name} })
    })
    this.getNewItem()
    this.getCustomerNewItem()
  },
  computed:{
    defaultBankAccount:function(){
        if(this.bankData.length >0) return this.bankData.map(item=>{return {value:item.id,label:item.name}})
        else return []
    }
  },
  watch:{
    defaultBankAccount(arg){
      console.log(arg)
      this.formItems.form.find(p=>p.name == "defaultBankAccountID").options =arg
    }
  },
  methods: {
    uploadSuccess(response){
          console.log(response);
          axiosDict[apiName].get('Employee_Attachment/NewItem').then(res=>{
            console.log(res)
            res.attachmentID =response[0].id
            res.parentID =response[0].parentID
            res.description =response[0].description
            res.parentType =response[0].parentType
            res.name =response[0].name
            res.type = "普通附件"
           axiosDict[apiName].post('Employee_Attachment',res).then(data=>{
            console.log(data)
            this.attachmentData.push(data)
          })
          })
        },
        handleClick(tab,event){
          this.$refs.bankTable.clearSelectionOuter()
          this.$refs.attaTable.clearSelectionOuter()
        },
        dltSelection(arg){
          console.log(arg)
          this.selectionData = arg
          this.dtlButtons.find(p=>p.text == '修改').disabled = arg.length !== 1 
          this.dtlButtons.find(p=>p.text == '删除').disabled = arg.length !== 1
          this.attaButtons.find(p=>p.text == '下载').disabled = arg.length !== 1
          this.attaButtons.find(p=>p.text == '删除').disabled = arg.length !== 1  
        },
        bankBtnEvent(args){
             switch (args.currentTarget.textContent.trim()) {
              case '新增' :
              {
                 this.editFormItems = this.bankFormItems
                 this.editDialogVisible = true
                 break
              }
              case '修改' :
              {
                this.isDtlEdit = true
                this.editFormItems = this.bankFormItems
                this.$nextTick(()=>{
                  this.editFormItems.form.map(item=>{
                  for(let i in this.selectionData[0]){
                    if(i == item.name)item.value = this.selectionData[0][i]
                  }
                })
                })
                this.editDialogVisible = true
                break
              }
              case '删除' :
                {
                  axiosDict[apiName]({
                    method:"delete",
                    url:"BankAccount",
                    data:this.selectionData[0]
                  }).then(res=>{
                    console.log(res)
                    if(res){
                      Vue.prototype.$notify.success({
                        title: '',
                        message: '删除成功',
                        duration: 2000,
                      })       
                        this.bankData.splice(this.bankData.indexOf(this.selectionData[0]), 1)
                    }
                  })
                  break
                }
            }
        },
        attaBtnEvent(args){
             switch (args.currentTarget.textContent.trim()) {
              case '新增' :
              {
                 this.parentId = this.isEdit ? this.currentData.id : this.isSaveDisabled ? this.currentNewData.id : this.customerNewItem.guid
                 this.uploadDialogVisible = true
                 break
              }
              case '下载' :
              {
                downloadFiles(this.selectionData[0].attachmentID)
                break
              }
              case '删除' :
                {
                  axiosDict[apiName]({
                    method:"delete",
                    url:"Employee_Attachment",
                    data:this.selectionData[0]
                  }).then(res=>{
                    console.log(res)
                    if(res){
                      Vue.prototype.$notify.success({
                        title: '',
                        message: '删除成功',
                        duration: 2000,
                      })       
                        this.attachmentData.splice(this.attachmentData.indexOf(this.selectionData[0]), 1)
                    }
                  })
                  break
                }
            }
        },
      looking(){
          this.$refs.masterView.hdrTableData.currentPage =1
          this.QUERYDATA()
        },
        QUERYDATA(){
          let param ={
            condition:JSON.stringify(this.$refs.masterView.condition),
            page: JSON.stringify(this.$refs.masterView.hdrTableData.currentPage),
            size: JSON.stringify(this.$refs.masterView.hdrTableData.pageSize),
          };
          this.$refs.masterView.dtlTableData.forEach(p=>{p.data.splice( 0, p.data.length)})
          axiosDict[apiName].get(this.uniqueKey + '/GetPageList?',{
            params:param
          }).then(res => {
              console.log(res)
              if(res){
                this.$refs.masterView.hdrTableData.data = []
                res.rows.forEach( item=> {
                  this.$refs.masterView.hdrTableData.data.push(item)
                });
                this.$refs.masterView.hdrTableData.total = res.total
              }
            })
        }, 
        getCustomerNewItem(){
          axiosDict[apiName].get('Employee/NewItem').then(res=>{
            console.log(res)
            this.customerNewItem = res
          })
        },
        getNewItem(){
          axiosDict[apiName].get('BankAccount/NewItem').then(res=>{
            console.log(res)
            delete res.guid
            this.bankNewItem = res
          })
        },
        customNew(){
            this.dialogVisible = true
          // this.getNewItem()
        },
        customEdit(){
          this.isEdit = true
          this.dialogVisible = true
          this.searchBank(this.currentData.id,true)
          this.getUploadedData(this.currentData.id,true)
          this.$nextTick(function(){ 
          this.formItems.form.forEach(p=>{
            for(let i  in this.currentData){
              if(i== p.name)p.value = this.currentData[i]
            }
          })
        })
        },
        customDelete(){
          this.$confirm('此操作将删除所选数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axiosDict[apiName]({
              method:"delete",
              url:this.uniqueDeployKey.api,
              data:this.currentData
            }).then(res=>{
              console.log(res)
              if(res){
                if(this.$refs.masterView.hdrTableData.currentPage != 1 && this.$refs.masterView.hdrTableData.data.length == 1){
                  this.$refs.masterView.hdrTableData.currentPage -= 1
                  this.QUERYDATA()
                }else{
                  this.QUERYDATA()
                }
                Vue.prototype.$notify.success({
                  title: '',
                  message: '删除成功',
                  duration: 2000,
                })
              }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            duration: 1000
          });
        });
        },
        tableSaveEvent(){
          if (this.$refs.formItems.validateForm()) {
                    console.log(this.customerNewItem)
                    // 判断编辑还是新建
                    this.isEdit
                        ? (this.formItemsData = Object.assign(
                              this.currentData,
                              this.formItemsData,
                          ))
                        : (this.formItemsData = Object.assign(
                              this.customerNewItem,
                              this.formItemsData,
                          ))
                    if (this.isEdit) {
                      console.log(this.formItemsData)
                        axiosDict[apiName]
                            .put(this.uniqueKey, this.formItemsData)
                            .then(res => {
                                console.log(res)
                                if (res) {
                                    Vue.prototype.$notify.success({
                                        title: '',
                                        message: '编辑成功',
                                        duration: 2000,
                                    })
                                    this.currentData = Object.assign( this.currentData, res )                                   
                                }                                
                            })
                    } else {
                        if(this.formItemsData.defaultBankAccountID == "" && this.bankData.length > 0)this.formItemsData.defaultBankAccountID = this.bankData[0].id
                        console.log(this.formItemsData)
                        axiosDict[apiName]
                            .post(this.uniqueKey, this.formItemsData)
                            .then(res => {
                                console.log(res)
                                if (this.isEdit == false && res) {
                                    Vue.prototype.$notify.success({
                                        title: '',
                                        message: '保存成功',
                                        duration: 2000,
                                    })
                                    this.currentNewData = JSON.parse(JSON.stringify(res))
                                    this.$refs.masterView.hdrTableData.data.unshift(res)
                                    this.isSaveDisabled = true
                                    this.getCustomerNewItem()
                                }
                            })
                    }
                }
        },
        tableBackEvent(){
          this.$refs.formItems.clearForm()
          this.$refs.formItems.resetForm()
          this.$refs.masterView.dtlTableData.forEach(p=>{p.data.splice( 0, p.data.length)})
          this.bankData = []
          this.attachmentData =[]
          this.isSaveDisabled = false
          this.formItemsData = null
          this.isEdit = false
          this.currentNewData = null
          this.dialogVisible = false
        },
        editTableSaveEvent(){
          if (this.$refs.editFormItems.validateForm()) {
              // 判断编辑还是新建
                    this.isDtlEdit
                        ? (this.editFormItemsData = Object.assign(
                              this.selectionData[0],
                              this.editFormItemsData,
                          ))
                        : (this.editFormItemsData = Object.assign(
                              this.bankNewItem,
                              this.editFormItemsData,
                          ))
                    console.log(this.editFormItemsData)
                    this.isEdit ? this.editFormItemsData.parentID = this.currentData.id  : this.isSaveDisabled ? this.editFormItemsData.parentID = this.currentNewData.id : this.editFormItemsData.parentID = this.customerNewItem.guid
                    if (this.isDtlEdit) {
                        axiosDict[apiName]
                            .put('BankAccount', this.editFormItemsData)
                            .then(res => {
                                console.log(res)
                                if (res) {
                                    Vue.prototype.$notify.success({
                                        title: '',
                                        message: '编辑成功',
                                        duration: 2000,
                                    })
                                    this.selectionData[0] = Object.assign( this.selectionData[0], res )
                                    this.editDialogVisible = false
                                }                                
                            })
                    } else {
                        axiosDict[apiName]
                            .post('BankAccount', this.editFormItemsData)
                            .then(res => {
                                console.log(res)
                                if (this.isDtlEdit == false && res) {
                                    Vue.prototype.$notify.success({
                                        title: '',
                                        message: '保存成功',
                                        duration: 2000,
                                    })
                                    this.bankData.unshift(res)
                                    this.editDialogVisible = false
                                }
                            })
                    }
          }
        },
        editTableBackEvent(){
          this.isDtlEdit = false
          this.$refs.editFormItems.clearForm()
          this.$refs.editFormItems.resetForm()
          this.editFormItemsData = null
          this.editDialogVisible = false
        },     
     // 以下方法均为自定义 无需生成
    invitationCode(){
      axiosDict[apiName].get(`Employee/GetInviteCode?empid=${this.userId}`)
      .then(res=>{
        console.log(res)
        if(res){
          this.inviteCode = res.inviteCode
          this.codeVisible = true
        }else{
          Vue.prototype.$notify.error({
            title: res.data.message,
            message: '详情请看控制台',
            duration: 0,
          })
        } 
      })
    },
    
    tableSelectionChange(arg){
      if(arg.length != 0){
        this.userId=arg[0].id
        this.currentData = arg[0]
      }      
    },
    usersBuilding(arg){
      console.log('testdialog')
      this.dialogs[0].src = `../usersBinding/binding.html#${token}#${this.userId}`
      this.dialogs[0].title ='用户角色绑定'
        setTimeout(() => {
          getDialog(this.dialogs,'dialog').visible = true
        }, 100)
    },
      //cool-single-view 
      tableRowClick(arg){
        console.log(arg)
        this.searchBank(arg.id)
        this.getUploadedData(arg.id)
      },
      // 查询银行账户
      searchBank(customerId,edit){
        axiosDict[apiName].get(`BankAccount/GetList?condition=[{"FieldName":"parentID","TableName":"[BankAccount]","Value":[{"value":"${customerId}"}],"TableRelationMode":"AND","Mode":"等于","DataType":"string"}]`).then(res=>{
          console.log(res)
          this.$refs.masterView.dtlTableData[0].data = []
          this.bankData = []
          if(res){
            edit ? res.forEach(p=>{this.bankData.push(p)})  : res.forEach(p=>{this.$refs.masterView.dtlTableData[0].data.push(p)})
          }
        })
      },
      // 获取附件列表
        getUploadedData(customerId,edit) {
          // let newData = this.isEdit ? this.currentData.id : this.customerNewItem.guid
          let params =  [{"FieldName":"parentID","TableName":"[Employee_Attachment]","Value":[{"value":customerId}],"TableRelationMode":"AND","Mode":"等于","DataType":"string"}]
          axiosDict[apiName].get(`Employee_Attachment/GetList?condition=${JSON.stringify(params)}`).then(res=>{
            console.log('附件列表',res);
            this.$refs.masterView.dtlTableData[1].data = []
            this.attachmentData = []
            if(res){
              edit ? res.forEach(p=>{this.attachmentData.push(p)}) :res.forEach(p=>{this.$refs.masterView.dtlTableData[1].data.push(p)})
            }
          })
        },
      tableRowDblclick(arg){
      
      },
      paginationSizeChange(arg){
        console.log(arg)
         this.$refs.masterView.hdrTableData.currentPage = 1
         this.$refs.masterView.hdrTableData.pageSize = arg
         this.QUERYDATA()
      },
      paginationCurrentChange(arg){
        console.log(arg)
        this.$refs.masterView.hdrTableData.currentPage = arg
        this.QUERYDATA()
      },
      getCondition(arg){

      },
      // cool-single-dialog
      updateForm(arg, value, label){
         this.formItemsData = arg
      },
      editUpdateForm(arg){
        this.editFormItemsData = arg
      },
      saveEvent(arg){

      }
  }
})