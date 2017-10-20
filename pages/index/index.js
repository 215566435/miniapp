//index.js
//获取应用实例
const app = getApp()
import {
  modal,
  takePhoto,
  getDict,
  PeopleInfo,
  getButtonShow
} from '../../utils/indexUtil'

const URL = app.globalData.URL
const getContext = '/api/miniapp/context/get'
const Upload = '/api/miniapp/pack/UploadPhoto/?packid='
const getPackInfo = '/api/miniapp/pack/getpack'
const markAs = '/api/miniapp/pack/markas'
const token = wx.getStorageSync('token') || ''
const header = { 'Authorization': 'token ' + token }


Page({
  data: {
    manifest: {},
    itemTable: [{ id: '序号', status: '状态', originalStockStatus: '库存', name: '商品名称', qty: '数量' }],
    stockStatus: {},
    packItemStatus: {},
    packStatus: {},
    peopleDetail: [],
    pictureID: null,//用于放置扫码id
    packState: {},
    id:''
  },
  onLoad: function () {
    wx.request({
      url: URL + getContext,
      header: header,
      method: 'POST',
      data: '{}',
      success: (res) => {
        this.setData({
          deliveryStatus: getDict(res.data.data.deliveryStatus),
          stockStatus: getDict(res.data.data.stockStatus),
          packItemStatus: getDict(res.data.data.packItemStatus),
          packStatus: getDict(res.data.data.packStatus)
        })
      }
    })
  },

  scan: function () {
    wx.scanCode({
      success: (res) => {
        if (!res) {
          modal('错误的条码', res.result)
          return
        }
        this.request(res.result)
      },
      fail: (res) => {
        if (res.errMsg !== 'scanCode:fail cancel') {
          console.log(res)
          modal('扫码出错', res)
        }
      }
    })
  },
  takePic: function () {
    const url = URL + Upload + this.data.pictureID
    const that = this
    console.log(url)
    takePhoto().then((res) => {
      wx.showLoading({
        title: '正在上传',
      })
      let tmpPath = res.tempFilePaths[0]
      wx.uploadFile({
        url: url,
        header: header,
        filePath: tmpPath,
        name: 'gezhongpick',
        success: function (res) {
          const resJson = JSON.parse(res.data)
          if (resJson.success) {
            console.log(resJson)
            wx.showModal({
              title: '上传成功'
            })
            that.setData({
              pictureID: null
            })
          } else {
            modal('上传失败', resJson.message)
          }
        }
      })
    }).catch((res) => {
      if (res.errMsg !== 'chooseImage:fail cancel') {
        modal('拍照发生错误')
      }
    })
  },
  /**
   * code:string,用于获取id
   */
  request: function (code) {
    wx.showLoading({
      title: '正在获取信息',
    })
    wx.request({
      url: URL + getPackInfo,
      header: header,
      method: 'POST',
      data: JSON.stringify({ id: code }),
      success: (res) => {
        wx.hideLoading()
        if (!res.data.success) {
          modal(res.data.message, '请求码:' + res.statusCode + '\n扫码内容：' + code)
          return
        }
        const manifest = res.data.data
        const peopleDetail = PeopleInfo(manifest)
        const showState = getButtonShow(manifest.packStatus, manifest.isPickup)
        this.setData({
          manifest: res.data.data,
          itemTable: [this.data.itemTable[0], ...res.data.data.items],
          peopleDetail: peopleDetail,
          pictureID: res.data.data.id,
          isMarked: code,
          packState: { state: this.data.packStatus[manifest.packStatus], show: showState }
        })
        console.log(manifest.packStatus)
      },
      fail: (res) => {
        modal('服务器请求失败', '服务器出错或出现网络波动')
        wx.hideLoading()
      }
    })
  },
  sendTo: function () {
    modal('确定标记为' + this.data.packState.state + '吗?', '确定后会将订单标记为' + this.data.packState.state).then((res) => {
      if (res.confirm) {
        wx.request({
          url: URL + markAs + this.data.manifest.packStatus,
          header: header,
          method: 'POST',
          data: JSON.stringify({ id: this.pictureID }),
          success: function (res) {
            if (!res.data.success) {
              console.log(res.data)
              modal('有点小问题', res.data.message)
            } else {

            }
          },
          fail: function () {

          }
        })
      }
    })

  }

})

