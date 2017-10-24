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
const Upload = '/api/miniapp/pack/MiniUploads/?packid='
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
    id: ''
  },
  onLoad: function (option) {
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
    if(option.id){
      this.request(option.id)
    }else{
      this.scan()
    }
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
          modal('扫码出错', '不支持的条形码类型')
        }
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
      console.log(header)
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
            const str = '照片上传成功，已标记为ID:'+id+'的附件'
            wx.showActionSheet({
              itemList: [str,'继续拍照', '查看订单详情'],
              success:function(res){
                if(res.tapIndex === 1){
                  that.takePic()
                }else{
                  that.request(id)
                }
              }
            })
          } else {
            modal(resJson.message,'ID:'+resJson.data.id + ' 的包裹不存在，点确定继续拍照').then((res)=>{
              if (res.confirm){
                that.takePic()
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
        console.log(res)
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

