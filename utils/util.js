const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
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
const rawPOST = (obj) => {
  return new Promise((resole, reject) => {
    wx.showNavigationBarLoading()
    wx.request({
      url: obj.url,
      header: obj.header || header,
      method: 'POST',
      data: JSON.stringify(obj.data),
      success: function (res) {
        wx.hideNavigationBarLoading()
        if (res.data.success === false) {
          wx.showModal({
            title: res.data.message
          })
        }
        resole(res)
      },
      fail: function (res) {
        reject(res)
      },
      complete:function(res){
        wx.hideNavigationBarLoading()
        resole(res)
      }
    })
  })
}

module.exports = {
  formatTime: formatTime,
  POST,
  rawPOST
}

