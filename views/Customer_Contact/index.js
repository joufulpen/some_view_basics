var resourceName = 'Customer_Contact' //资源名称 模板生成
var apiName = JSON.parse(window.coolLocals['index.json'])['apiName']
window.vm = new Vue({
  el: '#root',
  data: {
    // uniqueDeployKeyURL为前端已定义的变量 面的EmployeeInfo为后端模板生成的文件变量名 后面的为固定格式 需模板生成
    uniqueDeployKey: {
      api: apiDict[apiName] + resourceName
    },
    // axiosSetting 固定格式 需模板生成生成
    axiosSetting: {
      baseURL: apiDict[apiName],
    },
    // cool-single-dialog组件的json文件名以及它的api名称 uniqueKeyURL为前端已定义的变量 后面的EmployeeInfo为后端模板生成的文件变量名
    isMethods: {
      isGetCondition: false,
      isTableSelectionChange: false,
    },
    showModeList: true,
    loading:false,
    // 弹出框 固定格式 里面的值可按以下定义 需模板生成
    dialogs: [{
      top: '5vh',
      name: 'dialog',
      visible: false,
      collapse: false,
      width: '90%',
      title: '',
      src: '',
    }],

    //cool-single-dialog
    uniqueKey: apiDict[apiName] + resourceName,
    // 是否显示cool-single-dialog组件 默认值固定为false 需模板生成
    dialogVisible: false,
    isDialogMethods: {
      isUpdateForm: false,
      isSaveEvent: false,
    }
  },
  mounted() {
    // [{"FieldName":"CustomerCode","TableName":"[Customer_Contact]","Value":[{"value":"0000000002"}],"TableRelationMode":"AND","Mode":"参与","DataType":"string"}]
    // 固定格式 需模板生成
    this.$el.style.visibility = 'visible'
    this.$refs.singleView.query()
  },
  methods: {
    //cool-single-view
    tableRowClick(arg) {

    },
    tableRowDblclick(arg) {

    },
    tableSelectionChange(arg) {
      window.HASCHOOSEDATA = arg
    },
    paginationSizeChange(arg) {

    },
    paginationCurrentChange(arg) {

    },
    getCondition(arg) {
      let pid = window.location.hash.split('#')[2]
      arg.push({
        "FieldName": "CustomerCode",
        "TableName": "[Customer_Contact]",
        "Value": [{
          "value": pid
        }],
        "TableRelationMode": "AND",
        "Mode": "等于",
        "DataType": "string"
      })
    },
    // cool-single-dialog
    updateForm(arg) {
      console.log('==ENTER OUTSIDE UPDATEFORM==');
      if(arg){
        let pid = window.location.hash.split('#')[2]
        arg.customerCode = pid
      }
    },
    saveEvent(arg) {

    }
  }
})

// ===query.json===
// "CustomerCode": {
//   "value": "",
//   "mode": "不参与",
//   "modeList": [],
//   "dataType": "string",
//   "fieldName": "CustomerCode",
//   "tableRelationMode": "AND",
//   "tableName": "[Customer_Contact]",
//   "name": "客户序号",
//   "form": "input"
// },

// ===index.json===
// {
//   "type": "input",
//   "value": "",
//   "label": "客户序号",
//   "readonly": true,
//   "name": "customerCode",
//   "style": {
//     "width": "50%"
//   }
// },
