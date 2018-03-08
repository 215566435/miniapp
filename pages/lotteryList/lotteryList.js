// pages/lotteryList/lotteryList.js
import LotteryManager from '../../LotteryManager.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.lotter = new LotteryManager(this);
    this.lotter.getList();
  },
})