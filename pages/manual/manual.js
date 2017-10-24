// pages/manual/manual.js
const app = getApp()
const token = wx.getStorageSync('token') || ''
const header = { 'Authorization': 'token ' + token }
const URL = app.globalData.URL

Page({

  /**
   * 页面的初始数据
   */
  data: {
    URL:'',
    address:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      URL: URL,
      address:options.address
    })
  }
})