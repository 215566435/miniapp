// pages/product/product.js
const app = getApp()
const URL = app.globalData.URL + '/api/miniapp'
const token = wx.getStorageSync('token') || ''
const header = { 'Authorization': 'token ' + token }

const POST = (url, data) => {
  return new Promise((resole, reject) => {
    wx.showNavigationBarLoading()
    wx.request({
      url: url,
      header: header,
      method: 'POST',
      data: JSON.stringify(data),
      success: function (res) {
        wx.hideNavigationBarLoading()
        resole(res)
      },
      fail: function (res) {
        reject(res)
      }
    })
  })
}


Page({
  data: {
    itemList: [],
    currency: 0,
    showImage: false,
    URL: 'http://cdn2u.com',
    stockState: null,
    currentPage: 0,
    totalPages: 0,
    currentKeyWord: '',
    locationEnglish: [],
    locationChinese: [],
    pickerIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('载入')
    app.globalData.callBack.push(this.onContextFinished)
    if (app.globalData.location){
      this.onContextFinished()
    }
  },
  onContextFinished() {
    const keys = Object.keys(app.globalData.location)
    const chinese = keys.map((item) => {
      return app.globalData.location[item]
    })

    this.setData({
      stockState: app.globalData.stockStatus,
      locationEnglish: Object.keys(app.globalData.location),
      locationChinese: chinese
    })
    console.log(app.globalData.stockStatus)
  },
  onPullDownRefresh: function () {
    console.log('下拉更新')

    POST(
      URL + '/product/list',
      PostAction(
        this.data.currentKeyWord,
        1,
        this.data.locationEnglish[this.data.pickerIndex]
      )
    ).then((res) => {
      wx.stopPullDownRefresh();
      this.setData({
        itemList: res.data.data.items,
        currentPage: 0
      })
    })

  },
  bindPickerChange: function (e) {
    this.setData({
      pickerIndex: parseInt(e.detail.value)
    })
  },
  onReachBottom: function () {
    POST(
      URL + '/product/list',
      PostAction(
        this.data.currentKeyWord,
        this.data.currentPage + 1,
        this.data.locationEnglish[this.data.pickerIndex]
      )
    ).then((res) => {
      if (this.data.currentPage + 1 < this.data.totalPages) {
        console.log(this.data.currentPage + 1)
        this.setData({
          itemList: [...this.data.itemList, ...res.data.data.items],
          currentPage: this.data.currentPage + 1
        })
      } else {
        wx.showToast({
          title: '没有更多商品啦，尝试新的关键字吧！',
        })
      }
    })
  },
  tapCell: function (e) {
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: '../ProductDetail/ProductDetail?id=' + e.currentTarget.id + '&cur=' + this.data.currency,
    })
  },
  showImage: function (e) {
    this.setData({
      showImage: !this.data.showImage
    })
  },
  currency: function (e) {
    this.setData({
      currency: currencySwith[e.currentTarget.id]
    })
  },
  searchComfirm: function (res) {
    const PostJson = PostAction(
      res.detail.value,
      1,
      this.data.locationEnglish[this.data.pickerIndex]
    )
    const value = res.detail.value
    wx.request({
      url: URL + '/product/list',
      header: header,
      method: 'POST',
      data: JSON.stringify(PostJson),
      success: (res) => {
        this.setData({
          itemList: res.data.data.items,
          currentPage: res.data.data.page.currentPage,
          totalPages: res.data.data.page.totalPages,
          currentKeyWord: value
        })
        console.log(res)
      }
    })
  }
})
const currencySwith = { rmb: 1, aud: 0 }
const PostAction = (value, currentPage = 1, location = 'None') => {
  return {
    location: location,
    currentCate: 0,
    currency: "RMB",
    keyword: value,
    currentPage: currentPage
  }
}