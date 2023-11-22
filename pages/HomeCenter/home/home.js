const app = getApp()
const db = wx.cloud.database()
let loading = false
Page({
	data: {
		actions: [],
		keyword: '',
		showModal: true, // 是否显示模态框
		showImageModal: false, // 是否显示图片和提示信息框
		imageSrc: 'cloud://volunteer-4gaukcmqce212f11.766f-volunteer-4gaukcmqce212f11-1321274883/kefu.jpg', // 图片链接，请替换为实际的图片链接
	},
	onLoad() {
		wx.setNavigationBarTitle({
			title: '首页',
		})
		this.setData({
			myPos: app.globalData.userInfo['position'],
		})
	},
	onReady() { },
	onShow() {
		this.getData()
		wx.hideHomeButton()
	},
	//查找活动
	getData() {
		var that = this;
		db.collection('ActivityInfo')
			.where({
				status: '1'
			})
			.limit(10)
			.get()
			.then(res => {
				const processedData = res.data.map(item => {
					return {
						...item,
						intro: item.intro.length > 50 ? item.intro.slice(0, 50) + '...' : item.intro
					}
				})
				that.setData({
					actions: processedData
				})
			})
			.catch(err => {
				console.log(err);
			})
	},
	searchIcon(e) {
		this.setData({
			keyword: e.detail.value
		})
	},
	searchActivity() {
		var that = this
		//搜索栏不为空
		if (this.data.keyword) {
			wx.showLoading({
				title: '搜索中...',
				mask: true
			})
			wx.cloud.callFunction({
				name: 'searchTeam',
				data: {
					collection: 'ActivityInfo',
					keyword: this.data.keyword,
					name: 'actName'
				}
			})
				.then(res => {
					const processedData = res.result.map(item => {
						return {
							...item,
							intro: item.intro.length > 50 ? item.intro.slice(0, 50) + '...' : item.intro
						}
					})
					that.setData({
						actions: processedData
					})
					wx.hideLoading()
				})

		} else {
			this.getData();
		}

	},
	setShow(status, message, time = 1500, fun = false) {
		if (loading) {
			return
		}
		loading = true;
		try {
			this.setData({
				status,
				message,
				time,
				show: true,
			})
			setTimeout(() => {
				this.setData({
					show: false,
				})
				loading = false;
				// 触发回调函数
				if (fun) {
					this.end()
				}
			}, time)
		} catch {
			loading = false;
		}
	},
	showModal(e) {
		this.setData({
			modalName: e.currentTarget.dataset.target
		})
	},
	hideModal(e) {
		this.setData({
			modalName: null
		})
	},
	handleNotHaveOption() {
		this.setData({
			modalName: null, // 隐藏模态框
			showImageModal: true, // 显示图片和提示信息框
		});
	},
	longTap(e) {
		wx.previewImage({
			urls: [e.currentTarget.dataset.url],
			current: ''
		})
	},
	hideImgmodal() {
		this.setData({
			// 隐藏模态框
			showImageModal: false, // 显示图片和提示信息框
		})
	},
	//跳转一般都用这个
	navTo(e) {
		wx.$navTo(e)
	},
	toNewActivity() {
		if (!app.globalData.isAuth) {
			this.setShow("error", "请先前往个人中心注册");
			return 0
		}
		if (this.byhistory() || this.byBase()) {
			this.setData({
				modalName: null
			});
			wx.$navTo('/pages/PersonalCenter/newActivity/newActivity')
		} else {
			wx.$navTo("/pages/PersonalCenter/accountSignUp/accountSignUp")
		}
	},
	toregister() {
		if (this.byhistory() || this.byBase()) {
			wx.showToast({
				title: '你已注册成为志愿者',
				icon: 'none'
			})
		}
		else {
			wx.$navTo("/pages/PersonalCenter/accountSignUp/accountSignUp")
		}
	},
	byhistory() {
		var userInfo = wx.getStorageSync('userInfo')
		return userInfo ? true : false
	},
	byBase() {
		wx.cloud.database().collection('UserInfo')
			.where({
				_openid: app.globalData.userInfo["_openid"]
			})
			.get({
				success(res) {
					if (res.data.length) {
						return true
					} else {
						return false
					}
				},
				fail(err) {
					return false
				}
			});
	},
})