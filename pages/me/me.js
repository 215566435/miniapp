// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    name: '',
    avatarUrl: null,
    isValidUserName: true,
    isValidPsw: true,
    isAdmin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    wx.authorize({
      scope: 'scope.userInfo',
      success: function (res) {
      },
      fail: function (res) {
        wx.openSetting({
          success: function (res) {
            wx.reLaunch({
              url: './me',
            })
          }
        })
      }
    })

    wx.login({
      success: (res) => {
        //发送code出去
        let isOld = false
        if (!isOld) {
        }
                      // name: "，" + res.userInfo.nickName,
        wx.getUserInfo({
          success: (res) => {
            that.setData({

              avatarUrl: res.userInfo.avatarUrl
            })
          },
          fail: function (res) {
            wx.reLaunch({
              url: './me',
            })
          }
        })
      }
    })
  },
  onShow:function(){
    let token = wx.getStorageSync('token')
    const Type = wx.getStorageSync('type')
    const name = wx.getStorageSync('name')
    if(token){
      this.setData({
        isLogin:true,
        isAdmin: Type !=='Default'?true:false,
        name: '，'+name
      })
    }
  },
  onSearch: function () {
    wx.navigateTo({
      url: '../index/index',
    })
  },
  onLogin: function (e) {
    wx.navigateTo({
      url: '../login/login?id=' + e.currentTarget.id,
    })
  },
  onLogout:function(e){
    wx.setStorageSync('token', null)
    wx.setStorageSync('type', null)
    wx.reLaunch({
      url: './me',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }

})