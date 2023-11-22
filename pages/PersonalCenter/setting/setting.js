// pages/personalSetting/personalSetting.js
const app = getApp()
const db = wx.cloud.database()
Page({
	data: {
		isUpdate: false,
		isTextBoxVisible: false,
		showModal: null,
		grade: ['小学', '中学', '本科', '研究生', '博士', '已毕业'],
		loading: false,
		selectedYear: '请选择年份',
		isCollege: '未填写',
		college: '未填写',
		mygrade: '未填写'
	},
	onLoad(options) {
		this.setData({
			openid: app.globalData.userInfo["_openid"],
			name: app.globalData.userInfo["userName"] ? app.globalData.userInfo["userName"] : '未填写',
			phone: app.globalData.userInfo["phone"] ? app.globalData.userInfo["phone"] : '未填写',
			aliPay: app.globalData.userInfo["aliPay"] ? app.globalData.userInfo["aliPay"] : '未填写',
			school: app.globalData.userInfo["school"] ? app.globalData.userInfo["school"] : '未填写',
			mygrade: app.globalData.userInfo["grade"] ? app.globalData.userInfo["grade"] : '未填写',
			college: app.globalData.userInfo["college"] ? app.globalData.userInfo["college"] : '未填写',
			selectedYear: app.globalData.userInfo["year"] ? app.globalData.userInfo["year"] : '未填写',
		})
	},
	onReady() { },
	onShow() { },
	onHide() { },
	onUnload() {
		var that = this
		if (that.data.isUpdate) {
			wx.showLoading({
				title: '(数据上传中...)',
				mask: true
			})
			db.collection('UserInfo').where({
				_openid: this.data.openid
			}).update({
				data: {
					userName: this.data.name,
					school: this.data.school,
					grade: this.data.mygrade,
					college: this.data.college,
					phone: this.data.phone,
					aliPay: this.data.aliPay,
					year: this.data.selectedYear
				},
				success(res) {
					wx.hideLoading();
					// app.globalData.name = that.data.name
					// app.globalData.school = that.data.school
					// app.globalData.grade = that.data.mygrade
					// app.globalData.college = that.data.college
					// app.globalData.year = that.data.selectedYear
					// app.globalData.phone = that.data.phone
					// app.globalData.aliPay = that.data.aliPay

					// 在此处执行其他操作
				},
				fail(error) {
					console.error('更新失败', error);
				}
			})
		}

	},
	checkchange(e) {
		this.setData({
			isUpdate: !this.data.isUpdate
		})
	},
	showQRcode() {
		wx.previewImage({
			urls: ['cloud://volunteer-4gaukcmqce212f11.766f-volunteer-4gaukcmqce212f11-1321274883/kefu.jpg'],
			current: '',
		})
	},
	GradeChange(e) {
		console.log(e.detail.value)
		this.setData({
			Gindex: e.detail.value,
			mygrade: this.data.grade[e.detail.value]
		})
	},
	YearChange(e) {
		const value = e.detail.value;
		const year = value.substring(0, 4);
		this.setData({
			value: value,
			selectedYear: year
		});
	},
	openModal(e) {
		console.log('打开模态框')
		this.setData({
			showModal: e.currentTarget.dataset.target // 打开模态框
		});
	},
	closeModal() {
		this.setData({
			showModal: null // 关闭模态框
		});
	},
	handleSave() {
		// 调用API保存昵称到本地存储或后台服务器
		wx.showToast({
			title: '保存成功',
			icon: 'success'
		});
		this.closeModal(); // 保存后关闭模态框
		// wx.navigateBack(); // 返回上一页
	},
	showTextBox() {
		this.setData({
			isTextBoxVisible: !this.data.isTextBoxVisible, // 显示文本框
		});
	},
	hideTextBox() {
		this.setData({
			isTextBoxVisible: !this.data.isTextBoxVisible, // 隐藏文本框
		});
	},
})