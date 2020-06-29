
window.vm = new Vue({
  el: '#root',
  data: {
    dataList: [],
    options: [],
    empId: id,
    currentForm: {},
    currentRow: undefined,
    originalData: {},
    dialogVisible: false,
    collapsed: false,
    fullscreen: false,
    formItems: {
      form: [{
        type: 'input',
        value: '',
        label: '设置新密码',
        name: 'password',
        showPassword: true,
        rules:{
          required: true,
          trigger: 'change',
          message: '此项不能为空',
        }
      },{
        type: 'input',
        value: '',
        label: '确认新密码',
        name: 'passwordConfirm',
        showPassword: true,
        rules:{
          trigger: 'change',
          validator(rule, value, callback) {
            if (value === '') callback(new Error('请再次输入密码'))
            else if (value !== vm.formItems.form.find(p => p.name=='password').value)
              callback(new Error('两次输入密码不一致'))
            else callback()
          },
        }
      }]
    },
  },
  methods: {
    handleRoleChange(row) {
      axiosDict['system'].put(`AuthUsers`, row).then(rows => Object.assign(this.dataList.find(t=>t.id==rows.id), rows))
    },
    getData(empId) {
      return axios.all([this.getUserList(empId), this.getRoleOptions()])
    },
    getUserList(empId) {
      return axiosDict['system']
        .get(
          `AuthUsers/GetList?condition=[{"FieldName":"EmpID","TableName":"[InfoTable]","Value":[{"value":"${empId}"}],"TableRelationMode":"AND","Mode":"等于","DataType":"string"}]`
        )
        .then(data => (this.dataList = data))
    },
    getRoleOptions() {
      return axiosDict['system'].get(`AuthRole/GetList?condition=[]`).then(data => {
        console.log(data)
        this.options = data.map(r => {
          return {
            label: r.name,
            value: r.id,
            data: r,
          }
        })
      })
    },
    rowClick(arg) {
      this.currentRow = arg
    },
    updateForm(arg,value,label) {
      console.log(arg,value,label);
      this.currentForm = arg
    },
    resetPassword() {
      this.originalData.password = md5(`${this.originalData.username}${this.currentForm.password}`)
      axiosDict['authorityManagement'].post(`user`,this.originalData)
        .then(res => {
          this.dialogClose()
        })
    },
    dialogShow() {
      axiosDict['authorityManagement'].get(`user/getuser?username=${this.currentRow.name}`)
        .then(res => {
          this.originalData = res.user
          this.dialogVisible = true
        })
    },
    dialogClose() {
      this.currentRow = undefined
      this.$refs.table.setCurrentRow()
      this.dialogVisible = false
      this.$refs.formItems.resetForm()
    }
  },
  mounted() {
    this.getData(this.empId)
  },
})
