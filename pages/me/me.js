// pages/me/me.js
import {
  modal,
  takePhoto,
  getDict,
  PeopleInfo,
  getButtonShow
} from '../../utils/indexUtil'
import {
  rawPOST
} from '../../utils/util.js'

const app = getApp()
const Upload = '/api/miniapp/pack/MiniUploads/?packid='
const BindAttachment = '/api/miniapp/pack/BindAttachment'
const token = wx.getStorageSync('token') || ''
const header = { 'Authorization': 'token ' + token }
const URL = app.globalData.URL

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
    isAdmin: false,
    manual: false,
    manualInput:'',
    address:''
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
  onShow: function () {
    let token = wx.getStorageSync('token')
    const Type = wx.getStorageSync('type')
    const name = wx.getStorageSync('name')
    if (token) {
      this.setData({
        isLogin: true,
        isAdmin: Type !== 'Default' ? true : false,
        name: '，' + name
      })
    }
  },
  onSearch: function () {
    wx.scanCode({
      success: (res) => {
        if (!res) {
          modal('错误的条码', res.result)
          return
        }
        wx.navigateTo({
          url: '../index/index?id=' + res.result,
        })
      },
      fail: (res) => {
        if (res.errMsg !== 'scanCode:fail cancel') {
          console.log(res)
          modal('扫码出错', res)
        }
      }
    })

  },
  onLogin: function (e) {
    wx.navigateTo({
      url: '../login/login?id=' + e.currentTarget.id,
    })
  },
  onLogout: function (e) {
    wx.setStorageSync('token', null)
    wx.setStorageSync('type', null)
    wx.reLaunch({
      url: './me',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  manualInput: function (e) {
    this.setData({
      manualInput: e.detail.value
    })
  },
  manualtap: function (e) {
    this.setData({
      manual:false
    })
    console.log(this.data.manualInput)
    rawPOST({
      url: URL + BindAttachment,
      header: header,
      data: {
        id: this.data.manualInput,
        address: this.data.address
      }
    }).then((res) => {
      if (res.data.success) {
        modal('绑定成功')
      } else {
        console.log(res)
        modal('绑定失败', res.data.message)
      }
    })
  },
  takePic: function () {
    const url = URL + Upload + this.data.pictureID
    const that = this
    takePhoto().then((res) => {
      wx.showLoading({
        title: '正在上传',
      })
      let tmpPath = res.tempFilePaths[0]
      wx.uploadFile({
        url: url,
        header: header,
        filePath: tmpPath,
        name: 'dasd',
        success: function (res) {
          wx.hideLoading()
          console.log(res)
          if (res.statusCode !== 200) {
            modal('上传失败')
            return
          }
          const resJson = JSON.parse(res.data)
          if (resJson.success) {
            const id = resJson.data.id
            const str = '照片上传成功，已标记为ID:' + id + '的附件'
            wx.showActionSheet({
              itemList: [str, '继续拍照', '查看订单详情'],
              success: function (res) {
                if (res.tapIndex === 1) {
                  that.takePic()
                } else {
                  wx.navigateTo({
                    url: '../index/index?id=' + id,
                  })
                }
              }
            })
          } else {
            const address = resJson.data.address
            const id = resJson.data.id
            const str = resJson.message + ''
            const itemList = id ? [str, '重新拍照'] : [str, '重新拍照', '手动扫码', '手动输入单号']
            wx.showActionSheet({
              itemList: itemList,
              success: function (res) {
                if (actionStrategy[res.tapIndex]){
                  actionStrategy[res.tapIndex](that, address)
                }
              }
            })
          }
        },
        fail: function (res) {

        },
        complete: function (res) {
        }
      })
    }).catch((res) => {
      if (res.errMsg !== 'chooseImage:fail cancel') {
        console.log(res)
        modal('拍照发生错误')
      }
    })
  }

})

const actionStrategy = {
  1: function (that) {
    that.takePic()
  },
  2: function (that, address) {
    wx.scanCode({
      success: (res) => {
        if (!res) {
          modal('错误的条码', res.result)
          return
        }
        rawPOST({
          url: URL + BindAttachment,
          header: header,
          data: {
            id: res.result,
            address: address
          }
        }).then((res) => {
          if (res.data.success) {
            modal('绑定成功')
          } else {
            modal('绑定失败', "请重试").then()
          }
        })
      },
      fail: (res) => {
        if (res.errMsg !== 'scanCode:fail cancel') {
          console.log(res)
          modal('扫码出错', res)
        }
      }
    })
  },
  3: function (that,address) {
    that.setData({
      manual: true,
      address: address
    })
  }
}
