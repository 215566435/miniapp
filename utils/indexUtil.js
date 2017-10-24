export const modal = (title, content) => {
  let newContent = content||''
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: title,
      content: newContent,
      success: function (res) {
        resolve(res)
      }
    })
  })
}

export const takePhoto = () => {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        resolve(res)
      },
      fail: function (res) {
        reject(res)
      }
    })

  })
}

export function getDict(array) {
  var dic = {};
  for (var i = 0; i < array.length; i++) {
    if (array[i].text == '[CurrencyName]') {
      array[i].text = window.info.client.currency;
    }
    dic[array[i].key] = array[i].text;
  }
  return dic;
};

/**
* 收货人和送货人的名字，电话取出来放到数组里
*/
export function PeopleInfo(manifest) {
  console.log(manifest)
  const rev = manifest.receiver
  const send = manifest.sender
  const itemQty = manifest.items.length
  const rDict = ['name', 'phone', 'idNumber', 'address']
  const sDict = ['name', 'phone']
  let ary = []
  if (!rev || !send) {
    return []
  }
  rDict.forEach((name) => {
    const fix = rev[name] ? rev[name] : ''
    if (rev[name]) {
      ary.push(fix)
    }
  })
  sDict.forEach((name) => {
    const fix = send[name] ? send[name] : ''
    ary.push(fix)
  })

  const pInfo = ['收件人姓名：', '收件人电话：', '收件人身份证：', '收件人地址：', '发货人姓名：', '发货人电话：']
  const peopleDetail = pInfo.map((item, index) => {
    let idx = 0
    if (itemQty % 2 === 0) {
      idx = 1
    }
    const fix = ary[index] ? ary[index] : ''
    const info = item + fix
    const color = index % 2 === idx ? 'white' : '#eee'
    return [info, color]
  })
  return peopleDetail
}

export function getButtonShow(state, isPickup) {
  if (isPickup &&
    (state == 'WaitingForProcess'
      || state == 'WaitingStock'
      || state == 'Pending')) {
    return true
  }
  if (!isPickup &&
    (state == 'WaitingForProcess'
      || state == 'WaitingStock'
      || state == 'Pending')) {
    return true
  }
  if (state === 'ReadyToPickup') {
    return true
  }
  return true

} 