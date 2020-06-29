var resourceName = 'Company'//资源名称 模板生成
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
      isSaveEvent:true
     },
     uploadDialogVisible:false,
     parentId:"",
     parentType:"",
     newItemData:{},
     hasUploadData:[],
     currentData:null,
     isNew:false,
     newID:null,
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
     currentData:null,
     selectionData:[],
     editFormItemsData:null,
     tableHeigh:'250px',
     uploadDialogVisible: false,
     parentId: undefined,
     parentType: '',
     type:'',
     dialogTitle:"公司管理",
     editDialogTitle:"银行账户管理",
     editDialogVisible:false,
     justDialogWidth:'900px',
     editDialogWidth:"400px",
     showSaveButton:true,
     containerStyle: 'border:1px solid #DCDFE6;padding-bottom:0px',    
  },
  computed:{
    imgUploadData:function(){
      if(this.hasUploadData.length > 0)
        return this.hasUploadData.filter(item=>item.type == "公司LOGO")
      else return []
    },
    sealUploadData:function(){
      if(this.hasUploadData.length > 0)
        return this.hasUploadData.filter(item=>item.type == "公司公章")
      else return []
    },
    companyUploadData:function(){
      if(this.hasUploadData.length > 0)
        return this.hasUploadData.filter(item=>item.type == "普通附件")
      else return []
    },
   url: function(){return apiDict[apiName]},
   defaultBankAccount:function(){
        if(this.bankData.length >0) return this.bankData.map(item=>{return {value:item.id,label:item.name}})
        else return []
    }
  },
  watch:{
    defaultBankAccount(arg){
      console.log(arg)
      this.$refs.singleDialog.formItems.form.find(p=>p.name == "defaultBankAccountID").options =arg
    }
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
      }
    }
    this.getNewItem()
    this.getCompanyNewItem()
  },
  methods: {
        handleClick(tab,event){
          this.$refs.bankTable.clearSelectionOuter()
          this.$refs.attaTable.clearSelectionOuter()
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
                 this.parentId = this.isEdit ? this.currentData.id : this.isNew ? this.newID : this.newItemData.guid
                 this.parentType = "公司"
                 this.type = "普通附件"
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
                    url:"Company_Attachment",
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
        dltSelection(arg){
          console.log(arg)
          this.selectionData = arg
          this.dtlButtons.find(p=>p.text == '修改').disabled = arg.length !== 1 
          this.dtlButtons.find(p=>p.text == '删除').disabled = arg.length !== 1
          this.attaButtons.find(p=>p.text == '下载').disabled = arg.length !== 1
          this.attaButtons.find(p=>p.text == '删除').disabled = arg.length !== 1  
        },
        getNewItem(){
          axiosDict[apiName].get('BankAccount/NewItem').then(res=>{
            console.log(res)
            delete res.guid
            this.bankNewItem = res
          })
        },
        getCompanyNewItem(){
          axiosDict[apiName].get('Company/NewItem').then(res=>{
            console.log(res)
            this.newItemData = res
          })
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
                    this.isEdit ? this.editFormItemsData.parentID = this.currentData.id  : this.isNew ? this.editFormItemsData.parentID = this.newID : this.editFormItemsData.parentID = this.newItemData.guid
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
        editUpdateForm(arg){
        this.editFormItemsData = arg
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
      customNew(){     
          this.isEdit = false
          this.hasUploadData = []
          this.dialogVisible = true
        },
        
        newEdit(){
            this.isEdit = true
            this.dialogVisible = true
            this.searchBank(this.currentData.id,true)
            this.getUploadedData(this.currentData.id,true)  
            // this.getUploadedData()
            this.$nextTick(()=>{
              //将选中编辑数据映射到表单
            this.$refs.singleDialog.formItems.form.forEach(item => {
                for (let i in this.currentData) {
                    if (i == item.name) {
                        item.value = this.currentData[i]
                    }
                }
            })
            this.$refs.singleDialog.$refs.ruleForm.updateForm()
            })
          },
      uploadSuccess(response){
        console.log(response);
        axiosDict[apiName].get('Company_Attachment/NewItem').then(res=>{
          console.log(res)
          res.attachmentID =response[0].id
          res.parentID =response[0].parentID
          res.description =response[0].description
          res.parentType =response[0].parentType
          res.name =response[0].name
          this.type == "普通附件" ? res.type = "普通附件" : this.type == "公司LOGO" ? res.type = "公司LOGO" : res.type = "公司公章"
         axiosDict[apiName].post('Company_Attachment',res).then(data=>{
          console.log(data)
          this.hasUploadData.push(data)
        })
        })
      },
      imgUpload(){
        this.parentId = this.isEdit ? this.currentData.id :  this.isNew ? this.newID : this.newItemData.guid
        this.parentType = "公司"
        this.type="公司LOGO"
        this.uploadDialogVisible =!this.uploadDialogVisible
      },
      sealUpload(){
        this.parentId = this.isEdit ? this.currentData.id : this.isNew ? this.newID : this.newItemData.guid
        this.parentType = "公司"
        this.type = "公司公章"
        this.uploadDialogVisible =!this.uploadDialogVisible
      },
     
      downLoad(arg){
      console.log(arg)
       downloadFiles(arg.attachmentID)
      },
      deleteEvent(arg){
        console.log(arg)
        this.$confirm('此操作将删除所选数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            axios({
                method:"delete",
                url:apiDict[apiName]+'Company_Attachment',
                data:arg
              }).then(res=>{
                console.log(res)
                if(res) this.getUploadedData(this.isEdit ? this.currentData.id : this.newItemData.guid,true)
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
              duration: 1000
            });
          });
      },
      getDialog: function(name) {
        return this.dialogs.filter(function(dialog) {
          return dialog.name === name
        })[0]
      },
      //cool-single-view
      tableRowClick(arg){
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
          let params =  [{"FieldName":"parentID","TableName":"[Company_Attachment]","Value":[{"value":customerId}],"TableRelationMode":"AND","Mode":"等于","DataType":"string"}]
          axiosDict[apiName].get(`Company_Attachment/GetList?condition=${JSON.stringify(params)}`).then(res=>{
            console.log('附件列表',res);
            this.$refs.masterView.dtlTableData[1].data = []
            this.attachmentData = []
             this.hasUploadData = []
            if(res){
              edit ? res.forEach(p=>{this.hasUploadData.push(p)}) : res.filter(item=>item.type == "普通附件").forEach(p=>{this.$refs.masterView.dtlTableData[1].data.push(p)})              
            }
          })
        },
         // 获取附件列表
      // getUploadedData() {
      //   let newData = this.isEdit ? this.currentData.id : this.newItemData.guid
      //   let params =  [{"FieldName":"parentID","TableName":"[Company_Attachment]","Value":[{"value":newData}],"TableRelationMode":"AND","Mode":"等于","DataType":"string"}]
      //   axiosDict[apiName].get(`Company_Attachment/GetList?condition=${JSON.stringify(params)}`).then(res=>{
      //     console.log('附件列表',res);
      //     this.hasUploadData = []
      //     if(res)res.forEach(p=>this.hasUploadData.push(p))
      //   })
      // },
      tableRowDblclick(arg){

      },
      tableSelectionChange(arg){
        console.log(arg)
        this.currentData = arg[0]
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
      updateForm(arg,value,label){
        console.log(arg,value,label)
        this.formItemsData = arg
      },
      backEvent(){
        console.log('back-event')
        this.isNew = false
        this.newID = null
      },
      saveEvent(arg){
        let copyData = {}
          if(this.isEdit){ copyData = JSON.parse(JSON.stringify(this.currentData)) } 
            console.log(this.$refs.singleDialog)
          if (this.$refs.singleDialog.$refs.ruleForm.validateForm()) {
                    // 判断编辑还是新建
                    this.isEdit
                        ? (this.formItemsData = Object.assign(
                             copyData,
                              this.formItemsData,
                          ))
                        : (this.formItemsData = Object.assign(
                              this.newItemData,
                              this.formItemsData,
                          ))
                    console.log(this.formItemsData)
                    if (this.isEdit) {
                      this.formItemsData.recStatus = 1
                        axiosDict[apiName]
                            .put(this.uniqueKey, this.formItemsData)
                            .then(res => {
                                console.log(res)
                                if (res) {
                                    this.currentData = Object.assign(this.currentData,res)
                                    Vue.prototype.$notify.success({
                                        title: '',
                                        message: '编辑成功',
                                        duration: 2000,
                                    })
                                }
                            })
                    } else {
                        if(this.formItemsData.defaultBankAccountID == "" && this.bankData.length > 0)this.formItemsData.defaultBankAccountID = this.bankData[0].id
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
                                    this.isNew = true
                                    this.newID = res.id
                                    this.$refs.masterView.hdrTableData.data.unshift(res)
                                    this.getCompanyNewItem()
                                }
                            })
                    }
                    this.formItemsData = null
                }
      },
  }
})
