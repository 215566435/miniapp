// pages/login/login.js
import { rawPOST} from '../../utils/util.js'
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isOld: true,
    url: false,
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id === 'old') {
      this.setData({
        isOld: true
      })
    }
    const date = Date.now()
    const url = app.globalData.URL + '/api/miniapp/verify?id='
    this.setData({
      url: url + date,
      id: date
    })
  },
  onSmit: function (e) {
    rawPOST({
      url: app.globalData.URL + '/api/miniapp/login/login',
      data: {
        username: e.detail.value.user,
        password: e.detail.value.psw,
        verify: e.detail.value.code,
        UnionId: this.data.id
      }
    }).then((res)=>{
      if (res.data.success === false){
        this.onChange()
      }else{
        wx.setStorageSync('token', res.data.data.token)
        wx.setStorageSync('type', res.data.data.type)
        wx.setStorageSync('name', res.data.data.name)
        wx.navigateBack({
          delta: 1,
        })
        wx.showToast({
          title: '登陆成功，欢迎回来',
        })
      }
    }).catch((res)=>{
      console.log(res)
    })
  },
  /**
   * 换验证码
   */
  onChange: function (e) {
    const date = Date.now()
    const url = app.globalData.URL+'/api/miniapp/verify?id='
    this.setData({
      url: url + date,
      id: date
    })
  }
})