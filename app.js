//app.js
import { getDict } from './utils/indexUtil'
import { rawPOST } from './utils/util.js'

const URL = 'http://192.168.1.100:8005'
const getContext = '/api/miniapp/context/get'
App({
  onLaunch: function () {
    rawPOST({
      url: URL + getContext,
      header: { 'Authorization': 'token 00A3DDD6702C413B94A688BB3D5B604A' },
      data: '{}'
    }).then((res) => {
      this.globalData.stockStatus = getDict(res.data.data.stockStatus)
      this.globalData.location = getDict(res.data.data.stockLocation)
      this.globalData.callBack.forEach((cb) => {
        cb(this.globalData)
      })
    })

    rawPOST({
      url:URL +'/api/miniapp/login/getcurrentuser',
      method:"GET"
    }).then((res)=>{
      console.log(res)
    })

    // const token = wx.getStorageSync('token')
    // if (token) {
    //   wx.request({
    //     url: URL + '/api/miniapp/login/getcurrentuser',
    //     method: 'POST',
    //     data: "{}",
    //     success: (res) => {
    //       console.log(res)
    //       if (!res.data.data.isLogin) {
    //         wx.setStorageSync('token', null)
    //         wx.setStorageSync('type', null)
    //       }
    //     }
    //   })
    // }
  },
  globalData: {
    userInfo: null,
    callBack: [],
    URL: URL
  }
})



    // // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })