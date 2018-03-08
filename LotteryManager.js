export default class LotteryManager {
  constructor(page) {
    this.url = 'https://wx.niuaomall.com/api/miniapp/';
    this.page = page
  }

  fail = (res) => {
    if (res.data.message) {
      wx.showModal({
        title: '操作失败',
        content: res.data.message,
        Opportunity: '0'
      })
    } else {
      wx.showModal({
        title: '操作失败',
        content: '请稍后尝试',
        Opportunity: '0'
      })
    }
  }
  hideLoading() {
    setTimeout(() => {
      wx.hideNavigationBarLoading();
    }, 1000)
  }
  nochange() {
    wx.showModal({
      title: '你今天的机会用完了',
      content: '点击右上角分享给朋友，可以获得多次机会噢～',
      Opportunity: '0'
    })
  }
  refreshLotteryOpportunity(GUID) {
    wx.request({
      url: this.url + 'VouchersWechat/WeChatLotteryOpportunity',
      method: 'POST',
      data: {
        GUID: GUID
      },
      success: (r) => {
        this.hideLoading();

        this.page.setData({
          Opportunity: r.data.data.opportunities
        })
        if (r.data.data.opportunities === 0) {

        }
        if (r.data.data.success === false) {
          this.fail(r)
        }
      }
    })
  }

  onShare(ticket) {

    wx.request({
      url: this.url + 'VouchersWechat/ShareLottery',
      method: 'POST',
      data: {
        guid: wx.getStorageSync('GUID'),
        ticket: ticket
      },
      success: (r) => {
        console.log(r);
        wx.showModal({
          title: '分享成功',
          content: '您的好友打开后，您可获得额外一次抽奖机会'
        })
        if (r.data.data.success === false) {
          this.fail(r)
        }
      }
    })
  }

  getLotteryOpportunity(code, ticket) {
    const body = ticket ? {
      wechatcode: code,
      ticket: ticket
    } :
      { wechatcode: code }

    wx.request({
      url: this.url + 'VouchersWechat/WeChatLotteryOpportunity',
      method: 'POST',
      data: body,
      success: (r) => {
        if (r.data.success === false) {
          this.fail(r)
          return
        }

        console.log(r)
        if (r.data.data.opportunities === 0) {
          this.page.setData({
            Opportunity: '0'
          })
          this.nochange()
          return;
        }
        wx.setStorageSync('GUID', r.data.data.id)
        this.page.setData({
          Opportunity: r.data.data.opportunities
        })
      }
    })
  }

  getList() {
    const id = wx.getStorageSync('GUID');
    wx.request({
      url: this.url + 'VouchersWechat/VouchersList',
      method: 'POST',
      data: {
        id: id
      },
      success: (r) => {
        console.log(r)
        this.page.setData({
          array: r.data.data,
        })
      }
    })
  }

  postLottery(fn, fn2) {
    const id = wx.getStorageSync('GUID');
    wx.request({
      url: this.url + 'VouchersWechat/LotteryVouchers',
      method: 'POST',
      data: {
        id: id
      },
      success: (r) => {
        console.log(r)
        if (r.data.success) {

          fn(r.data.data.amount, r.data.data.opportunities);

        } else {
          fn2();
          this.fail(r);
        }

      },
      fail: this.fail
    })
  }

}
