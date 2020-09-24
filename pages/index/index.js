

const drawCanvas = require('../../js/canvas')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvas: {
      height: 2000,
      width: 375
    },
    testMode: 'aspectFill'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    drawCanvas.drawCanvas({
      selector: '#drawCanvas', // canvas的选择器
      // defaultNode: '', // 默认的节点
      autoSize: true,
      data: {
        backgroundColor: '#09bb07',
        node: [
          {
            src: 'https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg',
            text: 'mode=aspectFill',
            mode: this.data.testMode,
            css: {
              width: 200,
              height: 200,
              color: 'red'
            }
          },
          {
            css: {
              backgroundColor: '#fff0b3'
            }
          },
          {
            text: '左边的盒子',
            css: {
              color: '#ffffff',
              backgroundColor: '#ff4d4d'
            }
          },
          {
            text: '右边的盒子',
            css: {
              color: '#ffffff',
              backgroundColor: '#00ff95'
            }
          },
          {
            text: '文字居左',
            css: {
              color: '#333',
              backgroundColor: '#ff99ff',
              textAlign: 'left'
            }
          },
          {
            text: '文字居中',
            css: {
              color: '#333',
              backgroundColor: '#fff0b3',
              textAlign: 'center'
            }
          },
          {
            text: '文字居右',
            css: {
              color: '#333',
              backgroundColor: '#1a8cff',
              textAlign: 'right'
            }
          },
          {
            text: '文字居上',
            css: {
              color: '#333',
              backgroundColor: '#ff99ff',
              textAlign: 'center',
              textBaseline: 'top'
            }
          },
          {
            text: '文字居下',
            css: {
              color: '#333',
              backgroundColor: '#fff0b3',
              textAlign: 'center',
              textBaseline: 'bottom'
            }
          },
          {
            text: '文字居左上',
            css: {
              color: '#333',
              backgroundColor: '#1a8cff',
              textAlign: 'left',
              textBaseline: 'top'
            }
          }
        ]
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})