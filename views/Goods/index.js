var resourceName = 'Goods'//资源名称 模板生成
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
      isFalse:false,
      // 报价单url
      queryURL: apiDict['sale'] + '/price/list',
      saveURL: apiDict['sale'] + '/price/save',
      editURL: apiDict['sale'] + '/price/update',
      auditURL: apiDict['sale'] + '/price/submit',
      // 客户url
      customerURL: apiDict[apiName] + '/Customer/GetList?condition=[]',
     //cool-single-dialog 
     uniqueKey: apiDict[apiName] + resourceName,
     // 是否显示cool-single-dialog组件 默认值固定为false 需模板生成
     dialogVisible:false,
     isDialogMethods:{
      isUpdateForm:false,
      isSaveEvent:false,
     },
     materialTableData:[],
     supplierTableData:[],
     orderFormItems:null,
     editDialogTitle:'产品报价',
     goodsDialogTitle:'产品资料设置',
     dialogWidth:'780px',
     labelWidth:'115px',
     inColumns:[{
          "type": "selection",
          "width": '55px',
          selectable: function(row) {
            if (row.audit) {
              return false
            } else return true
          }
        },
        {
          "prop": "amount",
          "label": "报价"
        }
        ,
        {
          "prop": "customerName",
          "label": "客户名称"
        }
        ,
        {
          "prop": "audit",
          "label": "是否审核",
          "formatter": function(arg) {
            if (arg.audit == false) {
              return arg.audit.value = '否'
            }
            if (arg.audit == true) {
              return arg.audit.value = '是'
            }
          }
        }
        ,
        {
          "prop": "remark",
          "label": "备注"
        }
        ,

        {
          "prop": "updateName",
          "label": "填报人"
        },
        {
          "prop": "updateDate",
          "label": "填报时间",
          formatter(arg) {
            if(arg.createDate){
              return dayjs(arg.createDate).format("YYYY-MM-DD")
            }
          }
        },
        {
          "prop": "auditName",
          "label": "审核人"
        },
        {
          "prop": "auditDate",
          "label": "审核时间",
          formatter(arg) {
            if(arg.auditDate){
              return dayjs(arg.auditDate).format("YYYY-MM-DD")
            }
          }
        },
        {
          "prop": "active",
          "label": "状态",
          "formatter": function(arg) {
            if (arg.active == false) {
              return arg.active.value = '禁用'
            }
            if (arg.active == true) {
              return arg.active.value = '启用'
            }
          }
        }],
     columns:[
        {
          "prop": "largeCategoryCode",
          "label": "产品类型"
        }
        ,
        {
          "prop": "id",
          "label": "产品编号"
        }
        ,
        {
          "prop": "name",
          "label": "名称"
        }
        ,
        {
          "prop": "brandModel",
          "label": "型号"
        }
        ,

        {
          "prop": "unit",
          "label": "单位"
        }
        ],
        buttons:[{
        text: "新增",
        size: "mini",
        icon: "#iconxinzeng",
        disabled: false,
        type:"success"
      },{
        text: "删除",
        size: "mini",
        icon: "#iconERP_shanchu",
        disabled: true,
        type:"danger"
      },
      {
        text: "编辑",
        size: "mini",
        icon: "#iconERP_bianji",
        disabled: true,
        type:"primary"
      },
      {
        text: "审核",
        size: "mini",
        icon: "#iconshenhe",
        disabled: true,
        type:"warning"
      }
      ],
      editDialogFormItems:{
        "form":[{
          "type": "inputNumber",
            "value": "",
            "label": "报价",
            "name": "amount",
            "style": {
              "width": "100%"
            },
            "inputStyle":{
              "width":"178px"
            },
          "rules": {
            "required": true,
            "message": "报价不能为空",
            "trigger": "blur"
          }
        },{
            "type": "autocomplete",
            "data":[],
            "value": "",
            "label": "客户",
            "name": "customerName",
            "style": {
              "width": "100%"
            },
          "rules": {
            "required": true,
            "message": "客户不能为空",
            "trigger": "change"
          }
        },{
          "type": "input",
            "value": "",
            "label": "备注",
            "name": "remark",
            "style": {
              "width": "100%"
            }
        },{
            "type": "switch",
            "activeText":"启用",
            "inactiveText":"禁用",
            "value": true,
            "label": "状态",
            "name": "active",
            "style": {
              "width": "100%"
            }
        }]
      },
      tableHeight:'300px',
      dialogTitle:'',
      stripe:false,
      rowClickData:null,
      selectionData:null,
      hdrSelectionData:null,
      dialogUpdateFormData:null,
      productDialogVisible:false,
      editDialogTitleVisible:false,
      storeDialogVisible:false,
      purchaseDialogVisible:false,
      storeFormItems:null,
      purchaseFormItems:null,
      purchaseLabelWidth:"110PX",
      storeLabelWidth:'130PX',
      storeFormData:{},
      newStoreItems:null,
      newPurchaseItems:null,
      purchaseFormData:{},
      materialOptions:{},
      productFormItems:{
        form:[{
        "type": "select",
        "options":[],
        "value": "",
        "prefix":"basic",
        "api":"UnitSetting/GetList?condition=[]",
        "label": "生产单位",
        "name": "applyUnit",
        "readonly":false,
        "disabled":false,
        "style": {
          "width": "50%"
        }
      },{
        "type": "input",
        "value": "",
        "label": "1主单位 = ",
        "name": "applyUnitCoefficient",
        "inputStyle":{
          "width":"193px"
        },
        "appendSlotData":"生产单位",
        "readonly":false,
        "disabled":false,
        "style": {
          "width": "50%"
        }
      }]
      },
      productFormData:{},
      goodsFormItems:{},
      activeName:"first",
      hasId:false,
      newItemData:{},
      isEdit:false,
      formItemsData:{},
      allowNew:false,
      allowGoodsNew:false,
      newBaseData:{},
      newProductItems:null,
      currentTS:undefined,
      currentProductTS:undefined
  },
  mounted() {
    // 固定格式 需模板生成
    this.$el.style.visibility = 'visible'
    axiosDict[apiName].get(this.customerURL).then(res=>{
      console.log(res)
      this.editDialogFormItems.form[1].data = []
      if(res)res.map(item=>{this.editDialogFormItems.form[1].data.push({value:item.name})})
    })
    // JSON DATA
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
    // 采购单位数据
    axiosDict[apiName].get('UnitSetting/GetList?condition=[]').then(res=>{
      console.log(res)
      if(res)
        this.purchaseFormItems.form.find(p=>p.name == 'purchaseUnit').options = res.map(item=>{ return {value:item.name,label:item.name} })
        this.storeFormItems.form.find(p=>p.name == 'stockKeepingUnit').options = res.map(item=>{ return {value:item.name,label:item.name} })
        this.productFormItems.form.find(p=>p.name == 'applyUnit').options = res.map(item=>{ return {value:item.name,label:item.name} })
        this.goodsFormItems.form.find(p=>p.name == 'unit').options = res.map(item=>{ return {value:item.name,label:item.name} })
    })
    //会计科目数据 
    axiosDict[apiName].get('BaseProperty/GetList?condition=[%7B%22FieldName%22:%22Type%22,%22TableName%22:%22[BaseProperty]%22,%22Value%22:[%7B%22value%22:%22%E4%BC%9A%E8%AE%A1%E7%A7%91%E7%9B%AE%22%7D],%22TableRelationMode%22:%22AND%22,%22Mode%22:%22%E7%AD%89%E4%BA%8E%22,%22DataType%22:%22string%22%7D]').then(res=>{
      if(res)this.goodsFormItems.form.find(p=>p.name == 'accountSubject').options = res.map(item=>{ return {value:item.name,label:item.name} })
    })
    // 产品类型数据
    axiosDict[apiName].get('TypeofProduct/GetList?condition=[]').then(res=>{
      console.log(res)   
      if(res){
        this.materialOptions = res
        this.goodsFormItems.form.find(p=>p.name == 'largeCategoryCode').options = res.map(item=>{ return {value:item.name,label:item.name} })
      } 
    })
  },
  watch:{    
    rowClickData(arg){
      if(arg){
        if(arg.hasOwnProperty('id')){
        this.buttons.find(p => p.text == '审核').disabled = arg.audit                                        
      }
        this.buttons.find(p => p.text == '编辑').disabled = arg.audit
      }else{
        this.buttons.find(p => p.text == '编辑').disabled = arg == null 
      }       
    },
    supplierTableData(arg){
      if(arg.length == 0 ) this.rowClickData = null
    }
  }, 
  methods: {
      baseSubmit(){
        let copyData = {}
          if(this.isEdit){ copyData = JSON.parse(JSON.stringify(this.hdrSelectionData[0])) }
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
                                    let currentDataIndex = this.$refs.singleView.singleTableData.data.findIndex(
                                        item => {
                                            return item.id == res.id
                                        },
                                    )
                                    Vue.prototype.$notify.success({
                                        title: '',
                                        message: '编辑成功',
                                        duration: 2000,
                                    })
                                    console.log(currentDataIndex)
                                    this.$refs.singleView.singleTableData.data[
                                        currentDataIndex
                                    ] = Object.assign(
                                        this.$refs.singleView.singleTableData.data[currentDataIndex],
                                        res,
                                    )
                                    // this.newBackEvent()
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
                                    console.log(this.newBaseData) 
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
      customNew(){
        this.isEdit = false
        this.dialogVisible = true
        this.allowNew = true
        axiosDict[apiName].get(resourceName+'/NewItem').then(res => {
                console.log(res)
                if (res) this.newItemData = res
            })
      },
      customEdit(){
        this.isEdit = true
        this.allowNew = false
        this.dialogVisible = true
        this.storeManage()
        this.purchaseManage()
        this.productManage()
        this.$nextTick(function(){
          this.goodsFormItems.form.forEach(item => {
            for (let i in this.hdrSelectionData[0]) {
                if (i == item.name) {
                    item.value = this.hdrSelectionData[0][i]
                }
            }
        }) 
        this.$refs.goodsCoolForm.updateForm()   
        })
      },
      newBackEvent(){
        this.$refs.goodsCoolForm.clearForm()
        this.$refs.goodsCoolForm.resetForm()
        this.$refs.storeCoolForm.clearForm()
        this.$refs.storeCoolForm.resetForm()
        this.$refs.purchaseCoolForm.clearForm() 
        this.$refs.purchaseCoolForm.resetForm()
        this.$refs.productCoolForm.clearForm()
        this.$refs.productCoolForm.resetForm()
        this.newStoreItems = null
        this.newPurchaseItems = null
        this.newProductItems = null
        this.allowGoodsNew =false
        this.currentTS = undefined
        this.currentProductTS =undefined
        this.$refs.singleView.hdrClearSelectionOuter()  
        this.dialogVisible = false
        this.activeName = 'first'
      },
    tipFuc(){
        Vue.prototype.$notify.success({
                title: '操作成功',
                message: '操作成功',
                duration: 2000,
                    })
      },
    storeSaveEvent(){
        let allFormData = {}
        if(this.isEdit){
          let copyData = JSON.parse(JSON.stringify(this.hdrSelectionData[0]))
          if(this.newStoreItems !== null){
          allFormData = Object.assign(this.newStoreItems,this.storeFormData)
          allFormData = Object.assign(allFormData,copyData)
          console.log(this.storeFormData,copyData)
          allFormData.recStatus =1
        }    
        else{
          allFormData = Object.assign(allFormData,this.storeFormData)
          allFormData = Object.assign(allFormData,copyData)
        } 
        }else{
          allFormData = Object.assign(allFormData,this.storeFormData)
            allFormData = Object.assign(allFormData,this.newBaseData)
        }
        
        allFormData.kind = '产品'  
        console.log(allFormData)  
        axiosDict['warehouse'].post('/StockAttribute',allFormData).then(res=>{
        console.log(res)
        if(res){
             this.tipFuc()  
        }
      })
      },
      
      purchaseSaveEvent(){
        let allFormData = {}
        let copyData = {}
        if(this.isEdit){ copyData= JSON.parse(JSON.stringify(this.hdrSelectionData[0]))} 
        if(this.newPurchaseItems !== null ){
          this.purchaseFormData = Object.assign(this.newPurchaseItems,this.purchaseFormData)
           allFormData =  Object.assign(copyData , this.purchaseFormData)
           allFormData.recStatus =1
           if(this.currentTS !== undefined)allFormData.ts = this.currentTS
          console.log(allFormData)
          axiosDict['purchase'].put('Goods_Pur',allFormData).then(res=>{
          console.log(res)
          if(res){  this.currentTS = res.ts; this.tipFuc() }
        })
        }
        else{
          this.isEdit ? this.purchaseFormData = Object.assign(this.purchaseFormData,copyData) : this.purchaseFormData = Object.assign(this.purchaseFormData,this.newBaseData)
          if(this.currentTS !==undefined) {
            this.purchaseFormData.ts = this.currentTS
            this.purchaseFormData.recStatus =1
            axiosDict['purchase'].put('Goods_Pur',this.purchaseFormData).then(res=>{
              console.log(res)
              if(res){  this.currentTS = res.ts; this.tipFuc() }
            })
          }
          else{
            this.purchaseFormData.ts = null
            axiosDict['purchase'].post('Goods_Pur',this.purchaseFormData).then(res=>{
            console.log(res)
            if(res){  this.currentTS = res.ts;this.tipFuc() }
          })
          }     
        } 
      },
      productSaveEvent(){
        let allFormData = {}
        let copyData = {}
        if(this.isEdit){ copyData = JSON.parse(JSON.stringify(this.hdrSelectionData[0]))} 
        if(this.newProductItems !== null ){
          this.productFormData = Object.assign(this.newProductItems,this.productFormData)
           allFormData =  Object.assign(copyData , this.productFormData)
           allFormData.recStatus =1
           if(this.currentProductTS !== undefined)allFormData.ts = this.currentProductTS
          console.log(allFormData)
          axiosDict['production'].put('Goods_Prod',allFormData).then(res=>{
          console.log(res)
          if(res){  this.currentProductTS = res.ts; this.tipFuc() }
        })
        }
        else{
          this.isEdit ? this.productFormData = Object.assign(this.productFormData,copyData) : this.productFormData = Object.assign(this.productFormData,this.newBaseData)
          if(this.currentProductTS !== undefined){
            this.productFormData.ts = this.currentProductTS
            this.productFormData.recStatus = 1
            axiosDict['production'].put('Goods_Prod',this.productFormData).then(res=>{
              console.log(res)
              if(res){  this.currentProductTS = res.ts; this.tipFuc() }
            })
          }else{
            this.productFormData.ts = null
            axiosDict['production'].post('Goods_Prod',this.productFormData).then(res=>{
              console.log(res)
              if(res){ this.currentProductTS = res.ts;this.tipFuc() }
            })
          }  
        } 
      },
      storeManage(){
        let newAxios = axios.create({})
        newAxios.get(apiDict['warehouse']+'/StockAttribute?id='+this.hdrSelectionData[0].id).then(res=>{
          console.log(res)
          if(res.data.rows !== null){
            this.newStoreItems = res.data.rows
            this.storeFormItems.form.map(item=>{
              for(let i in res.data.rows){
                if(item.name == i)item.value = res.data.rows[i]
              }
            })
            this.$refs.storeCoolForm.updateForm()
          }
        })
    },
    purchaseManage(){
       let newAxios = axios.create({})
       newAxios.get(`${apiDict['purchase']}Goods_Pur?id=${this.hdrSelectionData[0].id}`).then(res=>{
          console.log(res)
          if(res.data.rows){
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
    productManage(){
      axiosDict['production'].get(`Goods_Prod/GetList?condition=[{"FieldName":"ID","TableName":"[InfoTable]","Value":[{"value":${JSON.stringify(this.hdrSelectionData[0].id)}}],"TableRelationMode":"AND","Mode":"等于","DataType":"string"}]`).then(res=>{
        console.log(res)
        if(res.length > 0){
            this.newProductItems = res[0]
            this.productFormItems.form.map(item=>{
              for(let i in res[0]){
                if(item.name == i)item.value = res[0][i]
              }
            })
            this.$refs.productCoolForm.updateForm()
        }
      })
    },
    storeUpdateForm(arg,value,label){      
      console.log(this.storeFormData)
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
    productUpdateForm(arg,val,label){
      console.log(arg)
      this.productFormData = arg
      if(label == '生产单位' && val == this.goodsFormItems.form.find(p=>p.name=='unit').value){
        this.productFormItems.form.find(p=>p.name == 'applyUnitCoefficient').value = 1
        this.productFormItems.form.find(p=>p.name == 'applyUnitCoefficient').disabled = true
      }
      if(label == '生产单位' && val != this.goodsFormItems.form.find(p=>p.name=='unit').value){
        this.productFormItems.form.find(p=>p.name == 'applyUnitCoefficient').value = 0
        this.productFormItems.form.find(p=>p.name == 'applyUnitCoefficient').disabled = false
      }
    },
    purchaseUpdateForm(arg,val,label){
      console.log(this.purchaseFormData)
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
    
    querySearch(queryString, cb, labelData) {
          console.log(queryString, cb,labelData)
            let index =  this.editDialogFormItems.form.findIndex(p=>{
                  return p.label == labelData
              })
              var results = queryString ? this.editDialogFormItems.form[index].data.filter(this.createFilter(queryString)) : this.editDialogFormItems.form[index].data
              cb(results)
        },
    createFilter(queryString) {
      return name => {
        return (
          name.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
        )
      }
    },
    queryData(){
      let param = {
         condition:JSON.stringify([{"FieldName":"code","TableName":"[InfoTable]","Value":[{"value":this.hdrSelectionData[0].id}],"TableRelationMode":"AND","Mode":"等于","DataType":"string"}]),
        orderBy:"code desc"
      }
      axiosDict['sale'].get('Price/GetList',{params:param}).then(res=>{
        console.log(res)
        this.supplierTableData = []
        if(res)res.map(item=>{this.supplierTableData.push(item) })  
      })
    },
    dialogUpdateForm(arg){
      this.dialogUpdateFormData = arg
    },
     productPrice(){ 
        this.queryData()
        this.materialTableData = []
        this.materialTableData.push(this.hdrSelectionData[0])   
        this.productDialogVisible = true
      },
      tableBackEvent(){
        console.log(this.$refs.formItems)
        this.$refs.formItems.clearForm()
        this.$refs.formItems.resetForm()
        this.editDialogTitleVisible = false
      },
      tableSaveEvent(){
        if(this.$refs.formItems.validateForm()){
          if(this.dialogTitle == '新增报价'){
          this.supplierTableData.unshift(this.dialogUpdateFormData)
          }
          else if(this.dialogTitle == '编辑报价'){
            this.supplierTableData[this.supplierTableData.indexOf(this.rowClickData)] = Object.assign( this.supplierTableData[this.supplierTableData.indexOf(this.rowClickData)],this.dialogUpdateFormData)
          }
           console.log(this.rowClickData)
           this.tableBackEvent()
        }
      },
      outSelection(arg){
        this.buttons[1].disabled = arg.length === 0
        if(arg.length != 0){
          this.selectionData = []
          arg.map(item=>{
            this.selectionData.push(item)
          })
        }        
      },
      outRowClick(arg){
        // this.buttons[1].disabled = arg == undefined 
        console.log(arg)

        this.rowClickData = arg 
      },
    
      // dialogSaveEvent(){
        
      // },
      // dialogBackEvent(){
      //    this.getDialog('dialog').visible = false
      // },
      getDialog: function(name) {
        return this.dialogs.filter(function(dialog) {
          return dialog.name === name
        })[0]
      },
      chooseSupplier(){
        this.dialogs[0].title = '选择供应商'              
        this.dialogs[0].src = `../Supplier/index.html#${token}#id#${this.dialogs[0].name}`
        setTimeout(() => {
          this.getDialog('dialog').visible = true
        }, 100)
      },
      buttonClick(args){
        switch (args.currentTarget.textContent.trim()) {
          case '编辑':
              { let i
                this.editDialogFormItems.form.map(item=>{
                  for(i in this.rowClickData){
                    if(i == item.name)item.value = this.rowClickData[i]
                  }
                })
                this.dialogTitle = '编辑报价'
                this.editDialogTitleVisible = true
                break;
              }
          case '新增':
              {
                this.dialogTitle = '新增报价'
                this.editDialogTitleVisible = true
                 break;  
              }
          case '审核':
              {
                let newAxios = axios.create({})
                newAxios.post(this.auditURL,{id:this.rowClickData.id,audit:true}).then(res=>{
                  console.log(res)
                  if(res.data.state == "success"){
                    this.queryData()
                    Vue.prototype.$notify.success({
                        title: res.data.message,
                        message: res.data.message,
                        duration: 2000,
                      })
                    this.rowClickData = null
                  }
                  
                })
                 break;  
              }    
          case '删除':
              {
                  this.selectionData.forEach(p => {
                    this.supplierTableData.splice(this.supplierTableData.indexOf(p), 1)
                  })
                
                break;
              }        
          default:
            break;
        }
      },
      backEvent(){
          this.supplierTableData = []
          this.rowClickData = null
          this.productDialogVisible = false
      },
      //cool-single-view 
      tableRowClick(arg){
      
      },
      tableRowDblclick(arg){
    
      },
      tableSelectionChange(arg){
          this.hdrSelectionData=[]
        if(arg.length != 0) arg.map(item=>{this.hdrSelectionData.push(item)}) 
      },  
      paginationSizeChange(arg){

      },
      paginationCurrentChange(arg){

      },
      getCondition(arg,value,label,data){
        if(label == '产品大类' && data.find(p=>p.FieldName =='LargeCategoryCode')){
        if(data.find(p=>p.FieldName =='LargeCategoryCode').Value[0].value !== ''){
          if(this.materialOptions.find(p=>p.name == data.find(p=>p.FieldName =='LargeCategoryCode').Value[0].value).children.length !== 0){
            this.$refs.singleView.queryCondition.ChildrenType.options = this.materialOptions.find(p=>p.name == data.find(p=>p.FieldName =='LargeCategoryCode').Value[0].value).children.map(item=>{ return {value:item.name,label:item.name} })
            if(data.find(p=>p.FieldName =='LargeCategoryCode').Value[0].value!== '' && !this.materialOptions.find(p=>p.name == data.find(p=>p.FieldName =='LargeCategoryCode').Value[0].value).children.some(item=>{ return item.name === this.$refs.singleView.queryCondition.ChildrenType.value})){
                    this.$refs.singleView.queryCondition.ChildrenType.value = ''
                    data.find(p=>p.FieldName =='ChildrenType').Value[0].value= ''
                  }
          }
          else
            this.$refs.singleView.queryCondition.ChildrenType.options =[]
        }else{
          this.$refs.singleView.queryCondition.ChildrenType.options = []
          this.$refs.singleView.queryCondition.ChildrenType.value = ''
        } 
       }
      },
      // cool-single-dialog
      updateForm(arg,value,label){
        console.log(arg,value,label)
        this.formItemsData = arg
        if(label == '产品大类' ){
          if(arg.largeCategoryCode !== ''){
            if(this.materialOptions.find(p=>p.name == arg.largeCategoryCode).children.length !== 0){
              this.goodsFormItems.form.find(p=>p.name == 'childrenType').options = this.materialOptions.find(p=>p.name == arg.largeCategoryCode).children.map(item=>{ return {value:item.name,label:item.name} })
              if(this.goodsFormItems.form.find(p=>p.name == 'childrenType').value !== '' && !this.materialOptions.find(p=>p.name == arg.largeCategoryCode).children.some(item=>{ return item.name ===  this.goodsFormItems.form.find(p=>p.name == 'childrenType').value})){
                this.goodsFormItems.form.find(p=>p.name == 'childrenType').value = ''
              }
            }
            else{this.goodsFormItems.form.find(p=>p.name == 'childrenType').options =[]}
          }else{
            this.goodsFormItems.form.find(p=>p.name == 'childrenType').options = []
            this.goodsFormItems.form.find(p=>p.name == 'childrenType').value = ''
          } 
        } 
      },
      priceSaveEvent(arg){
        if(this.supplierTableData.length != 0){
          this.materialTableData[0] = Object.assign(this.materialTableData[0],{code:this.materialTableData[0].id,type:'product'})
          console.log(this.supplierTableData,this.materialTableData[0])
          // this.loading = true
           let newAxios = axios.create({})
          newAxios.post(this.saveURL,{order:this.materialTableData[0],list:this.supplierTableData}).then(res=>{
            console.log(res)
            if(res.data.state == "success"){
              Vue.prototype.$notify.success({
                title: res.data.message,
                message: res.data.message,
                duration: 2000,
              })
              setTimeout(()=>{
                this.productDialogVisible = false
              },800)
            }else{
              Vue.prototype.$notify.info({
                title: res.data.message,
                message: res.data.message,
                duration: 2000,
              })
            }
          }).catch(e=>{
            Vue.prototype.$notify.success({
                title: e,
                message: e,
                duration: 2000,
              })
          }).finally(()=>{

          })
        }else{
          Vue.prototype.$notify.success({
                title: '供应商报价表不能为空 谢谢',
                message: '供应商报价表不能为空 谢谢',
                duration: 2000,
              })
        }        
      }
  }
})
