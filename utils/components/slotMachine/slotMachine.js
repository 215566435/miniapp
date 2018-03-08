/**
 * Class Machine
 * @class
 * @classdesc 老虎机游戏逻辑部分
 * @author pfan
 * 
 * @example
 *  new Machine(this,{
 *     height: 40,  //单个数字高度
 *     len: 10,     //单个项目数字个数
 *     transY1: 0,  //第一列初始位置
 *     num1: 3,     //第一列结束数字
 *     transY2: 0,  //第二列初始位置
 *     num2: 0,     //第二列结束数字
 *     transY3: 0,  //第三列初始位置
 *     num3: 0,     //第三列结束数字
 *     transY4: 0,  //第四列结束数字
 *     num4: 1,     //第四列结束数字
 *     speed: 24,   //速度
 *     callback: (idx, award) => {
 *      //结束回调， 参数对应宫格索引，对应奖项    
 *    }
 *  })
 */
class Machine {
  /**
   * @constructs Machine构造函数
   * @param  {Object} pageContext page路由指针
   * @param  {Object} opts      组件所需参数
   * @param  {Number} opts.height  单个数字高度
   * @param  {Number} opts.len  单个项目数字个数
   * @param  {Number} opts.transY1  第一列初始位置
   * @param  {Number} opts.num1     第一列结束数字
   * @param  {Number} opts.transY2  第二列初始位置
   * @param  {Number} opts.num2     第二列结束数字
   * @param  {Number} opts.transY3  第三列初始位置
   * @param  {Number} opts.num3     第三列结束数字
   * @param  {Number} opts.transY4  第四列初始位置
   * @param  {Number} opts.num4     第四列结束数字
   * @param  {Number} opts.speed    速度
   * @param  {Function} opts.callback    结束回调
   */
  constructor(pageContext, opts) {
    this.page = pageContext
    this.height = opts.height
    this.len = opts.len
    this.transY1 = opts.transY1
    this.num1 = opts.num1
    this.transY2 = opts.transY2
    this.num2 = opts.num2
    this.transY3 = opts.transY3
    this.num3 = opts.num3
    this.transY4 = opts.transY4
    this.num4 = opts.num4
    this.transY5 = opts.transY5
    this.num5 = opts.num5
    this.transY6 = opts.transY6
    this.num6 = opts.num6

    this.TimeArry = [0, 0, 0, 0, 0, 0]

    this.speed = opts.speed
    this.isStart = false
    this.endCallBack = opts.callback
    this.page.start = this.start.bind(this)
    this.endCallBackTime = 0;
  }

  stop(num1, num2, num3, num4, num5, num6, cb) {
    this.stopcallback = () => {
      clearInterval(this.timer);
      this.endCallBack = cb;
      this.start(num1, num2, num3, num4, num5, num6);

    }
  }



  start(num1, num2, num3, num4, num5, num6) {
    let { isStart, len, height, transY1, transY2, transY3, transY4, transY5, transY6, speed, endCallBack } = this;


    if (isStart) return
    this.isStart = true
    let totalHeight = height * len
    let sRange = Math.floor(Math.random() * 2 + 2)
    let halfSpeed = speed / 2
    let endDis1 = num1 == 0 ? 10 * height : num1 * height
    let endDis2 = num2 == 0 ? 10 * height : num2 * height
    let endDis3 = num3 == 0 ? 10 * height : num3 * height
    let endDis4 = num4 == 0 ? 10 * height : num4 * height
    let endDis5 = num5 == 0 ? 10 * height : num5 * height
    let endDis6 = num6 == 0 ? 10 * height : num6 * height
    let i1 = 1, i2 = 1, i3 = 1, i4 = 1, i5 = 1, i6 = 1
    let timerAry = this.TimeArry;



    this.timer = setInterval(() => {
      this.timer0 = setTimeout(() => {
        if (i1 <= sRange) {
          transY1 -= speed
          if (Math.abs(transY1) > totalHeight) {
            transY1 = transY1 + totalHeight
            i1++
          }
        } else if (i1 > sRange && i1 < sRange + 2) {
          transY1 -= halfSpeed
          if (Math.abs(transY1) > totalHeight) {
            transY1 = transY1 + totalHeight
            i1++
          }
        } else {
          if (transY1 == endDis1) return
          let dropSpeed = (endDis1 + transY1) / halfSpeed
          dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < 1 ? 1 : dropSpeed
          transY1 -= dropSpeed
          transY1 = Math.abs(transY1) > endDis1 ? transY1 = -endDis1 : transY1

          if (Math.abs(transY1) >= endDis1) {

            clearInterval(this.timer)
            clearTimeout(this.timer1)
            clearTimeout(this.timer2)
            clearTimeout(this.timer3)
            clearTimeout(this.timer4)
            clearTimeout(this.timer5)
            clearTimeout(this.timer0)
            this.isStart = false
            if (this.endCallBackTime === 0) {
              console.log('进来')
              endCallBack && endCallBack()
              this.endCallBackTime = 1
            }
            return
          }
        }
      }, timerAry[5])

      this.timer1 = setTimeout(() => {
        if (i2 <= sRange) {
          transY2 -= speed
          if (Math.abs(transY2) > totalHeight) {
            transY2 = transY2 + totalHeight
            i2++
          }
        } else if (i2 > sRange && i2 < sRange + 2) {
          transY2 -= halfSpeed
          if (Math.abs(transY2) > totalHeight) {
            transY2 = transY2 + totalHeight
            i2++
          }
        } else {
          if (transY2 == endDis2) return
          let dropSpeed = (endDis2 + transY2) / halfSpeed
          dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < 1 ? 1 : dropSpeed
          transY2 -= dropSpeed
          transY2 = Math.abs(transY2) > endDis2 ? transY2 = -endDis2 : transY2
        }
      }, timerAry[4])

      this.timer2 = setTimeout(() => {
        if (i3 <= sRange) {
          transY3 -= speed
          if (Math.abs(transY3) > totalHeight) {
            transY3 = transY3 + totalHeight
            i3++
          }
        } else if (i3 > sRange && i3 < sRange + 2) {
          transY3 -= halfSpeed
          if (Math.abs(transY3) > totalHeight) {
            transY3 = transY3 + totalHeight
            i3++
          }
        } else {
          if (transY3 == endDis3) return
          let dropSpeed = (endDis3 + transY3) / halfSpeed
          dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < 1 ? 1 : dropSpeed
          transY3 -= dropSpeed
          transY3 = Math.abs(transY3) > endDis3 ? transY3 = -endDis3 : transY3
        }
      }, timerAry[3])

      this.timer3 = setTimeout(() => {
        if (i4 <= sRange) {
          transY4 -= speed
          if (Math.abs(transY4) > totalHeight) {
            transY4 = transY4 + totalHeight
            i4++
          }
        } else if (i4 > sRange && i4 < sRange + 2) {
          transY4 -= halfSpeed
          if (Math.abs(transY4) > totalHeight) {
            transY4 = transY4 + totalHeight
            i4++
          }
        } else {
          let dropSpeed = (endDis4 + transY4) / halfSpeed
          if (num4 < 3) {
            dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < .1 ? .1 : dropSpeed
          } else if (num4 < 5 && num4 >= 3) {
            dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < .3 ? .3 : dropSpeed
          } else {
            dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < .3 ? .3 : dropSpeed
          }

          transY4 -= dropSpeed
          transY4 = Math.abs(transY4) > endDis4 ? transY4 = -endDis4 : transY4

        }
      }, timerAry[2])

      this.timer4 = setTimeout(() => {
        if (i5 <= sRange) {
          transY5 -= speed
          if (Math.abs(transY5) > totalHeight) {
            transY5 = transY5 + totalHeight
            i5++
          }
        } else if (i5 > sRange && i5 < sRange + 2) {
          transY5 -= halfSpeed
          if (Math.abs(transY5) > totalHeight) {
            transY5 = transY5 + totalHeight
            i5++
          }
        } else {
          let dropSpeed = (endDis5 + transY5) / halfSpeed
          if (num5 < 3) {
            dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < .1 ? .1 : dropSpeed
          } else if (num5 < 5 && num5 >= 3) {
            dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < .3 ? .3 : dropSpeed
          } else {
            dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < .3 ? .3 : dropSpeed
          }

          transY5 -= dropSpeed
          transY5 = Math.abs(transY5) > endDis5 ? transY5 = -endDis5 : transY5

        }
      }, timerAry[1])


      this.timer5 = setTimeout(() => {
        if (i6 <= sRange) {
          transY6 -= speed
          if (Math.abs(transY6) > totalHeight) {
            transY6 = transY6 + totalHeight
            i6++
          }
        } else if (i6 > sRange && i6 < sRange + 2) {
          transY6 -= halfSpeed
          if (Math.abs(transY6) > totalHeight) {
            transY6 = transY6 + totalHeight
            i6++
          }
        } else {
          let dropSpeed = (endDis6 + transY6) / halfSpeed
          if (num6 < 3) {
            dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < .1 ? .1 : dropSpeed
          } else if (num6 < 5 && num6 >= 3) {
            dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < .3 ? .3 : dropSpeed
          } else {
            dropSpeed = dropSpeed > halfSpeed ? halfSpeed : dropSpeed < .3 ? .3 : dropSpeed
          }

          transY6 -= dropSpeed
          transY6 = Math.abs(transY6) > endDis6 ? transY6 = -endDis6 : transY6

        }
      }, timerAry[0])

      this.page.setData({
        machine: {
          transY1: transY1,
          transY2: transY2,
          transY3: transY3,
          transY4: transY4-4,
          transY5: transY5,
          transY6: transY6
        }
      })

    }, 1000 / 60)
  }

  start2() {
    this.i = 0;
    const { height, len } = this;
    let totalHeight = height * len;


    this.timer = setInterval(() => {
      this.i = this.i - 17;

      if (-this.i > totalHeight) {
        // clearInterval(this.timer);
        this.i = 0;
        this.stopcallback && this.stopcallback();
      }

      this.page.setData({
        machine: {
          transY1: this.i,
          transY2: this.i,
          transY3: this.i,
          transY4: this.i,
          transY5: this.i,
          transY6: this.i
        }
      })


    }, 1000 / 60)

  }

  reset() {
    this.transY1 = 0
    this.transY2 = 0
    this.transY3 = 0
    this.transY4 = 0
    this.transY5 = 0
    this.transY6 = 0


    this.page.setData({
      machine: {
        transY1: 0,
        transY2: 0,
        transY3: 0,
        transY4: 0,
        transY5: 0,
        transY6: 0
      }
    })
  }

}


export default Machine
