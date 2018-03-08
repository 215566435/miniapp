// pages/lottery/lottery.js

import LotteryManager from '../../LotteryManager.js'
import SlotMachine from "../../utils/components/slotMachine/slotMachine.js"

Page({
  data: {
    num: 10,
    amount: 0,
    vouchersCode: 0,
  },

  dismiss() {
    this.setData({
      amount: 0
    })
  },
  onShow() {
    wx.showNavigationBarLoading();
    if (wx.getStorageSync('GUID')) {

      this.lotter.refreshLotteryOpportunity(wx.getStorageSync('GUID'));
    }
  },
  onLoad(options) {
    const info = wx.getSystemInfoSync();
    if (info.screenHeight > 780) {
      this.setData({
        style: "margin-top:-70px",
        btnStyle: "margin-top:-108px",
        recordStyle: "margin-top:-70px",
        numberStyle: "margin-top:-63px"
      })
    }

    this.lotter = new LotteryManager(this);
    wx.login({
      success: (res) => {
        if (res.code) {
          this.lotter.getLotteryOpportunity(res.code, options.ticket);
        }
      }
    })
  },

  onShareAppMessage() {
    const ticket = Date.now();
    return {
      title: 'AUSTGO澳购网喊您领红包啦！领取次数不设限，就是这么爽！',
      path: '/pages/lottery/lottery?ticket=' + ticket,
      success: (res) => {
        this.lotter.onShare(ticket)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onReady() {
    console.log("onReady")
  },
  onChou() {
    this.slotMachine = new SlotMachine(this, {
      height: 70,  //单个数字高度
      len: 10,
      transY1: 0,
      num1: 1,
      transY2: 0,
      num2: 2,
      transY3: 0,
      num3: 3,
      transY4: 0,
      num4: 4,
      transY5: 0,
      num5: 5,
      transY6: 0,
      num6: 6,
      speed: 24,
      callback: () => {

      }
    })

    this.slotMachine.start2();
    // setTimeout(() => {

    //   this.slotMachine.stop(1, 1, 1, 3, 3, 3, () => {
    //     this.setData({
    //       Opportunity: 3
    //     })
    //     wx.showModal({
    //       title: '恭喜你',
    //       content: `获得${3}元`,
    //     })
    //   });
    // }, 1000)


    this.lotter.postLottery((amount, opt) => {
      const num = amount.split('￥')[1];

      const $ = num.split('.');
      const dec = convert($[0]);
      const point = $[1];


      this.slotMachine.stop(dec[0], dec[1], dec[2], dec[3], point[0], point[1], () => {
        this.setData({
          Opportunity: opt
        })
        wx.showModal({
          title: '恭喜你',
          content: `获得${amount}元`,
        })
      });
    }, () => {
      this.slotMachine.stop(0,0,0,0,0,0, () => { });
    })
  },
  list() {
    wx.navigateTo({
      url: '../lotteryList/lotteryList',
    })
  }

})

function convert(desc) {
  console.log(desc)
  const i = parseInt(desc);
  if (i > 1000) {
    return i + '';
  }
  if (i > 100 && i < 1000) {
    return '0' + i;
  }
  if (i > 10 && i < 100) {
    return '00' + i
  }
  if (i > 0 && i < 10) {
    return '000' + i
  }
  return '0000'
}