//字段映射到列的关系表，格式为：字段名：列序号。如果改变列的位置，只需要修改这里的映射关系
var fieldMap = {
  name: "A",
  enName: "B",
};
//数据开始的行，第一行从1开始
var startRow = 2;

//导入的sheet的名称,也可以是个序号，第一个sheet从1开始
var sheetName = 3;

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

var resourceName = 'EnglishChinese' //资源名称 模板生成
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
    },
    importVisible: false,
    dialogLoading: false,
    uploadlist: [],

  },
  mounted() {
    // 固定格式 需模板生成
    this.$el.style.visibility = 'visible'
  },
  methods: {
    //cool-single-view
    tableRowClick(arg) {

    },
    tableRowDblclick(arg) {

    },
    tableSelectionChange(arg) {

    },
    paginationSizeChange(arg) {

    },
    paginationCurrentChange(arg) {

    },
    getCondition(arg) {

    },
    // cool-single-dialog
    updateForm(arg) {

    },
    saveEvent(arg) {

    },
    queryBtn() {
      let param = {
        condition: JSON.stringify(this.$refs.singleView.condition),
        page: JSON.stringify(this.$refs.singleView.singleTableData.currentPage),
        size: JSON.stringify(this.$refs.singleView.singleTableData.pageSize),
      };
      axiosDict[apiName].get(this.uniqueDeployKey.api + '/GetPageList', {
        params: param
      }).then(res => {
        console.log(res)
        if (res) {
          this.$refs.singleView.singleTableData.data = []
          res.rows.forEach(item => {
            this.$refs.singleView.singleTableData.data.push(item)
          });
          this.$refs.singleView.singleTableData.total = res.total
          this.$refs.singleView.buttons.find(p => p.text == '导入').disabled = res.rows.length !== 0
        }
      })
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
      axiosDict[apiName].get(`EnglishChinese/NewItem`)
        .then(res => {
          console.log('获取数据模板', res);
          delete res.guid
          return importData.map(p => (Object.assign(JSON.parse(JSON.stringify(res)), p)))
        })
        .then(data => {
          axiosDict[apiName].post(`EnglishChinese/AppendLst`, data)
            .then(res => {
              this.$refs.singleView.buttons.find(p => p.text == '导入').disabled = true
              this.dialogLoading = false
              this.importVisible = false
              this.queryBtn()
            })
        })
    },
  }
})
