// pages/ProductDetail/ProductDetail.js
import { POST } from '../../utils/util.js'

const app = getApp()
const URL = app.globalData.URL + '/api/miniapp'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    price: {},
    property: [],
    contentImages: [],
    currency: '',
    skuKey: [],
    skus: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const cur = {
      0: 'aud',
      1: 'rmb'
    }
    POST(URL + "/product/get", { id: options.id }).then((res) => {
      //const skus = parseSkus(res.data.data.skus, res.data.data.info)
      // console.log(res.data.data.skus)
      this.setData({
        imgUrls: res.data.data.image,
        name: res.data.data.name,
        price: {
          aud: res.data.data.price,
          rmb: res.data.data.priceRMB
        },
        property: res.data.data.info.length ? res.data.data.info : null,
        contentImages: res.data.data.contentImages,
        currency: cur[options.cur]
      })
    })
  }
})

function parseSkus(skus, info) {
  let property = []
  skus.forEach((sku) => {
    let stock = sku.status
    const props = sku.property
    let Map = {}
    const propsKey = Object.keys(props)

    for (let pk in props) {
      Map[pk] = props[pk]
    }
    Map['status'] = sku.status
    console.log(Map)
    property.push(Map)
  })

  // console.log(Map)
  return parseTwo(property)
}

function parseTwo(property) {
  let map = {}
  let firstKeyMap = {}
  const keys = Object.keys(property[0])
  const firstKey = keys[0]

  property.forEach((item) => {
    if (map[item[firstKey]]) {
      map[item[firstKey]].push(item)
    } else {
      map[item[firstKey]] = []
    }
  })

  console.log({ [firstKey]: map })
  return {
    [firstKey]: map
  }
}