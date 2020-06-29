//字段映射到列的关系表，格式为：字段名：列序号。如果改变列的位置，只需要修改这里的映射关系
var fieldMap = {
  id: "A",
  materialClass: "B",
  materialSubclass: "C",
  name: "D",
  byname: "E",
  enName: "F",
  version: "G",
  specifications: "H",
  pigment: "I",
  unit: "J",
};
//数据开始的行，第一行从1开始
var startRow = 2;

//导入的sheet的名称,也可以是个序号，第一个sheet从1开始
var sheetName = 0;

const RichText = XlsxPopulate.RichText

function readXLSx(file) {
  var fileData = new Blob([file]);
  var dtls = [];
  // A File object is a special kind of blob.
  return XlsxPopulate.fromDataAsync(fileData)
    .then(function(workbook) {
      var sheet = workbook.sheet(sheetName);
      var row = startRow;
      while (true) {
        var item = {};
        for (var col in fieldMap) {
          var field = fieldMap[col] + row;

          var value = sheet.cell(field).value();
          item[col] = value instanceof RichText ? value.text() : value;
        }
        //结束标记，当产品编号的内容是空白的，就跳出读取程序
        if (item["name"] == "" || item["name"] == undefined)
          break;
        dtls.push(item);
        row++;
      }
      return dtls
    });
}

function postSelection(args, source) {
      // console.log(5,'postSelection',args,source)
      let data = {
        data:vm.HASCHOOSEDATA,
        closeDialog:true
      }
      source.postMessage({ method: 'passSelection', args: { data: data, to: args.to } }, '*')
    }

function alertData(args) {
  // console.log(6,'alertData',args)
  // Vue.prototype.$alert(JSON.stringify(args))
}
window.formatterMethods = {
    isActive:function(arg){
    if (arg.active == true) {
        return arg.active.value = '是'
    }
    if (arg.active == false) {
      return arg.active.value = '否'
    }
  }
 }
var resourceName = 'Material'//资源名称 模板生成
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
     editDialogTitle:'新增/编辑/查看物料信息',
     labelWidth:'95px',
     purchaseLabelWidth:"105PX",
     storeLabelWidth:'130PX',
     formItemsData:null,
     currentData:null,
     field:null,
     isEdit:false,
     storeDialogVisible:false,
     purchaseDialogVisible:false,
     showButton:true,
     HASCHOOSEDATA:null,
     purchaseFormItems:null,
     storeFormItems:null,
     newStoreItems:null,
     newPurchaseItems:null,
     purchaseFormData:{},
     materialOptions:null,
     storeFormData:{},
     uploadDialogVisible: false,
     parentId: null,
     parentType: '物料',
     hasUploadData:[],
     isCheck:false,
     currentID:null,
     showImg:true,
     importVisible: false,
     dialogLoading: false,
     uploadlist: [],
     goodsDialogTitle:'',
     dialogWidth:'800px',
     showSaveButton:true,
     activeName:'first',
     goodsFormItems:{},
     purchaseLabelWidth:'110px',
     newBaseData:{},
     allowGoodsNew:false,
     allowNew:false,
     currentTS:null
  },
  computed:{
    url: function(){return apiDict[apiName]}
  },
  mounted() {
    for (let i in window.coolLocals) {
      if(i == 'dialogForm.json'){
        for (let p in JSON.parse(window.coolLocals[i])) {
        this[p] = JSON.parse(window.coolLocals[i])[p]
      }
      }
      if(i == 'index.json'){
        for (let p in JSON.parse(window.coolLocals[i])) {
        this[p] = JSON.parse(window.coolLocals[i])[p]
       }
      }
    }
    // 固定格式 需模板生成
    this.$el.style.visibility = 'visible'
    console.log(window.location.hash.split('#')[3],window.location.hash.split('#')[2])
    // window.location.hash.split('#')[3] !== undefined ||
    if(window.location.hash.split('#')[2] == 'ApplyMaterial'){
       this.$refs.singleView.buttons = this.$refs.singleView.buttons.slice(0,2)
       this.searchData()
    }
    // 物料类型数据
    axiosDict[apiName].get('TypeofMaterial/GetList?condition=[]&orderby=').then(res=>{
      console.log(res)
      if(res){
        this.materialOptions = res
         this.goodsFormItems.form.find(p=>p.name == 'materialClass').options = res.map(item=>{ return {value:item.name,label:item.name} })
      } 
    })
    //会计科目数据 
    axiosDict[apiName].get('BaseProperty/GetList?condition=[%7B%22FieldName%22:%22Type%22,%22TableName%22:%22[BaseProperty]%22,%22Value%22:[%7B%22value%22:%22%E4%BC%9A%E8%AE%A1%E7%A7%91%E7%9B%AE%22%7D],%22TableRelationMode%22:%22AND%22,%22Mode%22:%22%E7%AD%89%E4%BA%8E%22,%22DataType%22:%22string%22%7D]').then(res=>{
      if(res)this.goodsFormItems.form.find(p=>p.name == 'accountSubject').options = res.map(item=>{ return {value:item.name,label:item.name} })
    })
    // unit data
    axiosDict[apiName].get('UnitSetting/GetList?condition=[]').then(res=>{
    console.log(res)
      if(res)
        this.storeFormItems.form.find(p=>p.name == 'stockKeepingUnit').options = res.map(item=>{ return {value:item.name,label:item.name} })
        this.purchaseFormItems.form.find(p=>p.name == 'purchaseUnit').options = res.map(item=>{ return {value:item.name,label:item.name} })
        this.goodsFormItems.form.find(p=>p.name == 'unit').options = res.map(item=>{ return {value:item.name,label:item.name} })
    })

  },
  watch:{
      isCheck(arg){
        console.log(arg)
        this.goodsFormItems.form.forEach(item=>item.disabled = arg)
        this.purchaseFormItems.form.forEach(item=>item.disabled = arg)
        this.storeFormItems.form.forEach(item=>item.disabled = arg)
        this.allowGoodsNew = arg
        this.allowNew = arg
      }
      },
  methods: {
    storeUpdateForm(arg){
      this.storeFormData = arg
      console.log(this.storeFormData)
    },
    purchaseUpdateForm(arg){
      this.purchaseFormData = arg
    },
    customNew(){     
        this.isEdit = false
        this.allowNew = true
        this.hasUploadData = []
        this.dialogVisible = true
        axiosDict[apiName].get('Material/NewItem').then(res=>{
          console.log(res)
          this.newItemData = res
        })
      },
      handleClick(tab,eve){
        console.log(tab,eve)
        this.activeName = tab.name
        console.log(this.activeName)
      },
      newBackEvent(){
        console.log(this.$refs.goodsCoolForm,this.$refs.storeCoolForm,this.$refs.singleView)
        this.$refs.goodsCoolForm.clearForm()
        this.$refs.goodsCoolForm.resetForm()
        this.$refs.storeCoolForm.clearForm()
        this.$refs.storeCoolForm.resetForm()
        this.$refs.purchaseCoolForm.clearForm() 
        this.$refs.purchaseCoolForm.resetForm()
        this.newStoreItems = null
        this.newPurchaseItems = null
        this.newProductItems = null
        this.allowGoodsNew =false
        this.isCheck = false
        this.currentTS = null
        this.$refs.singleView.hdrClearSelectionOuter()  
        this.dialogVisible = false
        this.activeName = 'first'
      },
      queryBtn(){
        this.searchData()
      },
    searchData(pageSize,currentPage) {
      let param = {
        condition: JSON.stringify(this.$refs.singleView.condition),
        page: currentPage ? JSON.stringify(currentPage) : JSON.stringify(1),
        size: pageSize ? JSON.stringify(pageSize) : JSON.stringify(this.$refs.singleView.singleTableData.pageSize),
        orderBy:"ID"
      };
      axiosDict[apiName].get(this.uniqueDeployKey.api + '/GetPageList', {
        params: param
      }).then(res => {
        console.log(res)
        if (res) {
          if(currentPage === undefined)this.$refs.singleView.singleTableData.currentPage = 1
          this.$refs.singleView.singleTableData.data = []
          res.rows.forEach(item => {
            this.$refs.singleView.singleTableData.data.push(item)
          });
          this.$refs.singleView.singleTableData.total = res.total
          this.$refs.singleView.buttons.find(p => p.text == '导入').disabled = res.rows.length !== 0
        }
      })
    },
    enter(arg){
      this.currentID = arg
    },
    leave(){
      this.currentID = null
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
              url:apiDict[apiName]+'Material_Attachment',
              data:arg
            }).then(res=>{
              console.log(res)
              if(res) this.getUploadedData()
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            duration: 1000
          });
        });
    },
    addaccessory(){
      this.parentId = this.isEdit ? this.currentData.id : this.newItemData.guid
      // let randomID = 'Material_' + new Date()
      this.uploadDialogVisible =!this.uploadDialogVisible
    },
    uploadSuccess(response, attachment) {
      console.log('!!!UPLOAD-SUCCESS!!!');
      console.log(response);
      axiosDict[apiName].get('Material_Attachment/NewItem').then(res=>{
        console.log(res)
        res.attachmentID =response[0].id
        res.parentID =response[0].parentID
        res.description =response[0].description
        res.parentType =response[0].parentType
        res.name =response[0].name
        res.type = "普通附件"
       axiosDict[apiName].post('Material_Attachment',res).then(data=>{
        console.log(data)
        this.hasUploadData.push(data)
      })
      })
      // this.hasUploadData.push(response[0])
    },
    newEdit(){
      this.isEdit = true
      this.allowNew = false
      this.dialogVisible = true  
      this.storeManage()
      this.purchaseManage()
      this.getUploadedData()
      this.$nextTick(()=>{
        //将选中编辑数据映射到表单
      this.goodsFormItems.form.forEach(item => {
          for (let i in this.currentData) {
              if (i == item.name) {
                  item.value = this.currentData[i]
              }
          }
      })
      this.$refs.goodsCoolForm.updateForm()
      })
      
    },
    // 获取附件列表
      getUploadedData() {
        let newData = this.isEdit ? this.currentData.id : this.newItemData.guid
        let params =  [{"FieldName":"parentID","TableName":"[Material_Attachment]","Value":[{"value":newData}],"TableRelationMode":"AND","Mode":"等于","DataType":"string"}]
        axiosDict[apiName].get(`Material_Attachment/GetList?condition=${JSON.stringify(params)}`).then(res=>{
          console.log('附件列表',res);
          this.hasUploadData = []
          if(res)res.forEach(p=>this.hasUploadData.push(p))
        })
      },
    storeBackEvent(){
        this.$refs.storeCoolForm.map(item=>{
          item.clearForm()
          item.resetForm()
        })
        this.newStoreItems = null
        this.storeDialogVisible = false
    },
    purchaseBackEvent(){
        this.$refs.purchaseCoolForm.map(item=>{
          item.clearForm()
          item.resetForm()
        })
        this.purchaseDialogVisible = false
        this.newPurchaseItems =null
    },
    storeManage(){
        let newAxios = axios.create({})
         newAxios.get( apiDict['warehouse']+'/StockAttribute?id='+ this.currentData.id).then(res=>{
          console.log(res)
          if(res !== null){
            this.newStoreItems = res.data.rows
            this.storeFormItems.form.map(item=>{
              for(let i in res.data.rows){
                if(item.name == i)item.value = res.data.rows[i]
              }
            })
            console.log(this.newStoreItems)
            this.$refs.storeCoolForm.updateForm()
          }
        })
    },
    purchaseManage(){
       let newAxios = axios.create({})
        newAxios.get(`${apiDict['purchase']}Goods_Pur?id=${this.currentData.id}`).then(res=>{
          console.log(res)
          if(res.data.rows){
            console.log(res.data.rows)
            this.newPurchaseItems = res.data.rows
            this.purchaseFormItems.form.map(item=>{
              for(let i in res.data.rows){
                if(item.name == i)item.value = res.data.rows[i]
              }
            })
            this.$refs.purchaseCoolForm.updateForm()
          }
        })
    },
    storeUpdateForm(arg,value,label){
      console.log(arg,value,label)
      this.storeFormData = arg
      if(label == '库存单位' && value == this.goodsFormItems.form.find(p=>p.name=='unit').value) {
          this.storeFormItems.form.find(p=>p.name == 'transferCoefficient').value = 1
          this.storeFormItems.form.find(p=>p.name == 'transferCoefficient').disabled = true
        }
      if(label == '库存单位' && value != this.goodsFormItems.form.find(p=>p.name=='unit').value){
          this.storeFormItems.form.find(p=>p.name == 'transferCoefficient').value = 0
          this.storeFormItems.form.find(p=>p.name == 'transferCoefficient').disabled = false
      }  
    },
    purchaseUpdateForm(arg,val,label){
      console.log(arg,val,label)
      this.purchaseFormData = arg
      if(label == '采购单位' && val == this.goodsFormItems.form.find(p=>p.name=='unit').value){
        this.purchaseFormItems.form.find(p=>p.name == 'purchaseUnitNum').value = 1
        this.purchaseFormItems.form.find(p=>p.name == 'purchaseUnitNum').disabled = true
      }
      if(label == '采购单位' && val != this.goodsFormItems.form.find(p=>p.name=='unit').value){
        this.purchaseFormItems.form.find(p=>p.name == 'purchaseUnitNum').value = 0
        this.purchaseFormItems.form.find(p=>p.name == 'purchaseUnitNum').disabled = false
      }
    },
      check(){
        this.isCheck = true
        this.newEdit()
      },
      // kind:"物料"
      masterUpdateForm(arg,label){

      },
      //cool-single-view
      tableRowClick(arg){

      },
      tableRowDblclick(arg){

      },
      tableSelectionChange(arg){
        console.log(arg)
        this.currentData = arg[0]
        this.HASCHOOSEDATA = arg
      },
      paginationSizeChange(arg){
        this.$refs.singleView.singleTableData.currentPage = 1
        this.$refs.singleView.singleTableData.pageSize = arg
        this.searchData(this.$refs.singleView.singleTableData.pageSize)
      },
      paginationCurrentChange(arg){
         this.$refs.singleView.singleTableData.currentPage = arg
         this.searchData(this.$refs.singleView.singleTableData.pageSize,this.$refs.singleView.singleTableData.currentPage)
      },
      getCondition(arg,value,label,data){
        console.log(arg,value,label,data)
        if(label == '物料大类' && data.find(p=>p.FieldName =='MaterialClass')){
        if(data.find(p=>p.FieldName =='MaterialClass').Value[0].value !== ''){
          if(this.materialOptions.find(p=>p.name == data.find(p=>p.FieldName =='MaterialClass').Value[0].value).children.length !== 0){
            this.$refs.singleView.queryCondition.MaterialSubclass.options = this.materialOptions.find(p=>p.name == data.find(p=>p.FieldName =='MaterialClass').Value[0].value).children.map(item=>{ return {value:item.name,label:item.name} })
            if(data.find(p=>p.FieldName =='MaterialClass').Value[0].value!== '' && !this.materialOptions.find(p=>p.name == data.find(p=>p.FieldName =='MaterialClass').Value[0].value).children.some(item=>{ return item.name === this.$refs.singleView.queryCondition.MaterialSubclass.value})){
                    this.$refs.singleView.queryCondition.MaterialSubclass.value = ''
                    data.find(p=>p.FieldName =='MaterialSubclass').Value[0].value= ''
                  }
          }
          else
            this.$refs.singleView.queryCondition.MaterialSubclass.options =[]
        }else{
          this.$refs.singleView.queryCondition.MaterialSubclass.options = []
          this.$refs.singleView.queryCondition.MaterialSubclass.value = ''
          data.find(p=>p.FieldName =='MaterialSubclass').Value[0].value= ''
        }
       }
      },
      // cool-single-dialog
      updateForm(arg,value,label){
            console.log(arg,value,label)
            this.formItemsData = arg
            if(label == '物料大类' ){
              console.log(arg,label,this.materialOptions)
              if(arg.materialClass !== ''){
                console.log(arg.materialClass,this.materialOptions,this.materialOptions.find(p=>p.name == arg.materialClass))
                if(this.materialOptions.find(p=>p.name == arg.materialClass).children.length !== 0){
                  this.goodsFormItems.form.find(p=>p.name == 'materialSubclass').options = this.materialOptions.find(p=>p.name == arg.materialClass).children.map(item=>{ return {value:item.name,label:item.name} })
                  if(this.goodsFormItems.form.find(p=>p.name == 'materialSubclass').value !== '' && !this.materialOptions.find(p=>p.name == arg.materialClass).children.some(item=>{ return item.name ===  this.goodsFormItems.form.find(p=>p.name == 'materialSubclass').value})){
                    this.goodsFormItems.form.find(p=>p.name == 'materialSubclass').value = ''
                  }
                }
                else
                  this.goodsFormItems.form.find(p=>p.name == 'materialSubclass').options =[]
              }else{
                this.goodsFormItems.form.find(p=>p.name == 'materialSubclass').options = []
                this.goodsFormItems.form.find(p=>p.name == 'materialSubclass').value = ''
              }
            }
            else if(label == undefined){
                if(arg.materialClass !== ''){
                console.log(arg.materialClass,this.materialOptions,this.materialOptions.find(p=>p.name == arg.materialClass))
                if(this.materialOptions.find(p=>p.name == arg.materialClass).children.length !== 0){
                  this.goodsFormItems.form.find(p=>p.name == 'materialSubclass').options = this.materialOptions.find(p=>p.name == arg.materialClass).children.map(item=>{ return {value:item.name,label:item.name} })
                  if(this.goodsFormItems.form.find(p=>p.name == 'materialSubclass').value !== '' && !this.materialOptions.find(p=>p.name == arg.materialClass).children.some(item=>{ return item.name ===  this.goodsFormItems.form.find(p=>p.name == 'materialSubclass').value})){
                    this.goodsFormItems.form.find(p=>p.name == 'materialSubclass').value = ''
                  }
                }
                else
                  this.goodsFormItems.form.find(p=>p.name == 'materialSubclass').options =[]                
              }
            }
      },
      storeSaveEvent(){
          let allFormData = {}
          if(this.isEdit){
            let copyData = JSON.parse(JSON.stringify(this.currentData))
            delete copyData.safetyStock
            delete copyData.stockKeepingUnit
            delete copyData.description
            if(this.newStoreItems !== null){
            allFormData = Object.assign(this.newStoreItems,this.storeFormData)
            allFormData = Object.assign(allFormData,copyData)
            console.log(this.storeFormData,copyData)
            allFormData.recStatus = 1
          }    
          else{
            allFormData = Object.assign(allFormData,this.storeFormData)
            allFormData = Object.assign(allFormData,copyData)
          } 
        }else{
          allFormData = Object.assign(allFormData,this.storeFormData)
            allFormData = Object.assign(allFormData,this.newBaseData)
        }
        allFormData.kind = '物料'
        console.log(allFormData)
        axiosDict['warehouse'].post('StockAttribute',allFormData).then(res=>{
        console.log(res)
        if(res){ this.tipFuc() }
      })
      },
      tipFuc(){
        Vue.prototype.$notify.success({
                title: '操作成功',
                message: '操作成功',
                duration: 2000,
                      })
      },
      purchaseSaveEvent(){
        let allFormData = {}
        let copyData = {}
        if(this.isEdit){ copyData = JSON.parse(JSON.stringify(this.currentData)) }
        console.log(this.currentData) 
        if(this.newPurchaseItems !== null ){
          delete copyData.ts
          delete copyData.guid 
          this.purchaseFormData = Object.assign(this.newPurchaseItems,this.purchaseFormData)
          allFormData =  Object.assign(this.purchaseFormData,copyData)
          allFormData.recStatus = 1
          if(this.currentTS !== null)allFormData.ts = this.currentTS
          console.log(allFormData)
          axiosDict['purchase'].put('Goods_Pur',allFormData).then(res=>{
          console.log(res)
          if(res){ this.currentTS = res.ts;this.tipFuc() }
        })
        } 
        else{
           this.isEdit ? this.purchaseFormData = Object.assign(this.purchaseFormData,copyData) : this.purchaseFormData = Object.assign(this.purchaseFormData,this.newBaseData)
           if(this.currentTS !== null){
              this.purchaseFormData.ts = this.currentTS
              this.purchaseFormData.recStatus = 1
              console.log(this.purchaseFormData)
              axiosDict['purchase'].put('Goods_Pur',this.purchaseFormData).then(res=>{
              console.log(res)
              if(res){  this.currentTS = res.ts; this.tipFuc() }
            })
           }else{
              // this.purchaseFormData.ts = null
              console.log(this.purchaseFormData)
              axiosDict['purchase'].put('Goods_Pur',this.purchaseFormData).then(res=>{
                console.log(res)
                if(res){ this.currentTS = res.ts; this.tipFuc() }
              })
           }
        }
      },
      saveEvent(arg){
        let copyData = {}
          if(this.isEdit){ copyData = JSON.parse(JSON.stringify(this.currentData)) } 
          // this.updateForm()
          if (this.$refs.goodsCoolForm.validateForm()) {
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
                                    // 编辑 根据当前数据的id 在表格数据中找到它所在的索引 然后将编辑好的数据替换
                                    // let currentDataIndex = this.$refs.singleView.singleTableData.data.findIndex(
                                    //     item => {
                                    //         return item.id == res.id
                                    //     },
                                    // )
                                    this.currentData = Object.assign(this.currentData,res)
                                    Vue.prototype.$notify.success({
                                        title: '',
                                        message: '编辑成功',
                                        duration: 2000,
                                    })
                                    console.log(this.currentData)
                                    // if(this.newPurchaseItems !== null )this.purchaseSaveEvent()
                                    // console.log(currentDataIndex)
                                    // this.$refs.singleView.singleTableData.data[
                                    //     currentDataIndex
                                    // ] = Object.assign(
                                    //     this.$refs.singleView.singleTableData.data[currentDataIndex],
                                    //     res,
                                    // )
                                }
                                

                                this.formItemsData = null
                            })
                    } else {
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
                                    this.$refs.singleView.singleTableData.data.unshift(res)
                                    this.newBaseData = JSON.parse(JSON.stringify(res))
                                    this.allowNew = false
                                    this.allowGoodsNew =true
                                    // this.newBackEvent()
                                } else {
                                }
                                this.formItemsData = null
                            })
                    }
                }
      },
      importBtn() {
        this.importVisible = true
      },
      // 导入操作
      btnImport_click() {
        this.dialogLoading = true
        console.log(this.uploadlist);
        var file = this.uploadlist[0].raw
        readXLSx(file).then(rows => {
          //这里是结果，另外程序处理
          console.debug(rows);
          vm.handleImport(rows)
        })
      },
      importDialogClose() {
        this.uploadlist = []
        this.importVisible = false
      },
      handleChange(file, fileList) {
        if (fileList.length > 1) fileList.splice(0, 1)
        this.uploadlist = fileList
      },
      handleRemove(file, fileList) {
        this.uploadlist = fileList
      },
      handleImport(importData) {
        axiosDict[apiName].get(`Material/NewItem`)
          .then(res => {
            console.log('获取数据模板', res);
            delete res.guid
            return importData.map(p => (Object.assign(JSON.parse(JSON.stringify(res)), p)))
          })
          .then(data => {
            axiosDict[apiName].post(`Material/AppendMaterial`, data)
              .then(res => {
                this.$refs.singleView.buttons.find(p => p.text == '导入').disabled = true
                this.dialogLoading = false
                this.importVisible = false
                this.searchData()
              })
          })
      },
  }
})

// purchase guid: "31b33a48-2849-430f-8f80-d724ee64646e"
// material  guid: "fb498b41-38cd-4caf-91ec-a82defa79e12"