// 最后更新时间 2020年9月23日14:40:22
// 当前微信基础库版本 2.13.0
// 最低要求基础库版本 2.7.0


let drawCanvas = (options) => {
  let {selector, autoSize} = options
  if (!selector) {
    return
  }
  // 不需要获取自动位置
  if (!autoSize) {
    getCtx(options)
    return
  }
  // 如果需要自动获取定位以及宽高
  getViewSize('.canvas-data-item').then((nodeDataList) => {
    console.log(nodeDataList)
    if (options.data.node && options.data.node.length != 0) {
      for (let i in options.data.node) {
        const nodeItem = nodeDataList.shift()
        if (!nodeItem) {
          break
        }
        if (options.data.node[i].css) {
          options.data.node[i].css.left = nodeItem.left
          options.data.node[i].css.top = nodeItem.top
          options.data.node[i].css.width = nodeItem.width
          options.data.node[i].css.height = nodeItem.height
        } else {
          options.data.node[i].css = {
            left: nodeItem.left,
            top: nodeItem.top,
            height: nodeItem.height,
            width: nodeItem.width
          }
        }
      }
    }
    getCtx(options)
  })
}

let getCtx = (options) => {
  let selector = options.selector
  let data = options.data || {}
  console.log(data)
  const query = wx.createSelectorQuery()
  query.select(selector)
  .fields({
    node: true,
    size: true
  })
  .exec((res) => {
    const canvas = res[0].node
    const width = res[0].width
    const height = res[0].height
    const ctx = canvas.getContext('2d')
      const dpr = wx.getSystemInfoSync().pixelRatio
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    data.canvasHeight = height
    data.canvasWidth = width
    draw({
      canvas,
      ctx,
      data
    })
  })
}

let draw = async (options) => {
  const {canvas, ctx, data} = options
  if (data.backgroundColor) {
    fillRoundedRectangle({ctx, canvas, x: 0, y: 0, width: data.canvasWidth, height: data.canvasHeight, backgroundColor: data.backgroundColor})
  }
  for (let i in data.node) {
    const item = data.node[i]
    let css = item.css
    css = unitsConversion(css)
    let center = {
      x: css.x + (css.width / 2),
      y: css.y + (css.height / 2)
    }
    ctx.save()
    if (css.backgroundColor) {
      fillRoundedRectangle({ctx, canvas, height: css.height, width: css.width, x: css.x, y: css.y, borderRadius: css.borderRadius, backgroundColor: css.backgroundColor})
    }
    if (item.src) {
      await drawImage({ctx, canvas, height: css.height, width: css.width, x: css.x, y: css.y, borderRadius: css.borderRadius, borderWidth: css.borderWidth, borderColor: css.borderColor, src: item.src, mode: item.mode})
    }
    if (item.text) {
      setCtxText({ctx, canvas, height: css.height, width: css.width, x: css.x, y: css.y, fontSize: css.fontSize, fontWeight: css.fontWeight, color: css.color, textAlign: css.textAlign, textBaseline: css.textBaseline, maxLine: css.maxLine, padding: css.padding, text: item.text})
    }
    if (css.borderWidth) {
      strokeRoundedRectangle({ctx, canvas, height: css.height, width: css.width, x: css.x, y: css.y, borderRadius: css.borderRadius, borderWidth: css.borderWidth, borderColor: css.borderColor})
    }
    ctx.restore()
  }
}

// 绘制图片
let drawImage = (options) => {
  return new Promise((resolve) => {
    let ctx = options.ctx || {}
    let canvas = options.canvas || {}
    let x = options.x || 0
    let y = options.y || 0
    let width = options.width || 0
    let height = options.height || 0
    let borderRadius = options.borderRadius || 0
    let borderWidth = options.borderWidth || 0
    let borderColor = options.borderColor || '#ffffff'
    let src = options.src || ''
    let mode = options.mode || 'scaleToFill' // 默认使用拉伸填充模式
    // 绘制border
    if (borderWidth > 0) {
      strokeRoundedRectangle({
        ctx,
        x: x,
        y: y,
        width: width,
        height: height,
        borderWidth,
        borderColor,
        borderRadius
      })
    }
    let img = canvas.createImage()
    img.src = src
    img.onload = () => {
      ctx.save()
      drawRectPath({
        ctx,
        x,
        y,
        width,
        height,
        borderRadius
      })
      ctx.clip()
      let imgHeight = img.height
      let imgWidth = img.width
      // 如果能获取到图片真实大小
      if (imgHeight && imgWidth) {
        let newOptions = imgMode({x, y, width, height, imgWidth, imgHeight, mode})
        x = newOptions.x
        y = newOptions.y
        height = newOptions.height
        width = newOptions.width
      }
      ctx.drawImage(img, x, y, width, height)
      ctx.restore()
      resolve('fill image success')
    }
  })
}

// 勾勒路径
let drawRectPath = (options) => {
  let ctx = options.ctx || {}
  let x = options.x || 0
  let y = options.y || 0
  let width = options.width
  let height = options.height
  let borderRadius = options.borderRadius
  // ctx.translate(x, y)
  if (2 * borderRadius > width || 2 * borderRadius > height) {
    borderRadius = (Math.min(width, height)) / 2
  }
  ctx.beginPath()
  ctx.arc(x + width - borderRadius, y + height - borderRadius, borderRadius, 0, 0.5 * Math.PI)
  ctx.lineTo(x + borderRadius, y + height)
  ctx.arc(x + borderRadius, y + height - borderRadius, borderRadius, 0.5 * Math.PI, Math.PI)
  ctx.lineTo(x + 0, y + borderRadius)
  ctx.arc(x + borderRadius, y + borderRadius, borderRadius, Math.PI, 1.5 * Math.PI)
  ctx.lineTo(x + width - borderRadius, y + 0)
  ctx.arc(x + width - borderRadius, y + borderRadius, borderRadius, 1.5 * Math.PI, 2 * Math.PI)
  ctx.lineTo(x + width, y + height - borderRadius)
  ctx.closePath()
}

// 绘制空心圆角矩形
let strokeRoundedRectangle = (options) => {
  // ctx canvasContent， x 左上角横坐标， y 左上角纵坐标， width 矩形宽度， height 矩形高度，
  // borderRadius 圆角大小， lineWidth border宽度， strokeStyle border颜色
  let ctx = options.ctx || {}
  let x = options.x || 0
  let y = options.y || 0
  let width = options.width || 0
  let height = options.height || 0
  let borderRadius = options.borderRadius || 0
  let borderWidth = options.borderWidth || 1
  let borderColor = options.borderColor || '#ffffff'
  ctx.save()
  drawRectPath({
    ctx,
    x,
    y,
    width,
    height,
    borderRadius
  })
  ctx.lineWidth = borderWidth
  ctx.strokeStyle = borderColor
  ctx.stroke()
  ctx.restore()
}

// 绘制实心圆角矩形
let fillRoundedRectangle = (options) => {
  // ctx canvasContent， x 左上角横坐标， y 左上角纵坐标， width 矩形宽度， height 矩形高度，
  // borderRadius 圆角大小， backgroundColor 背景颜色
  let ctx = options.ctx || {}
  let x = options.x || 0
  let y = options.y || 0
  let width = options.width || 0
  let height = options.height || 0
  let borderRadius = options.borderRadius || 0
  let backgroundColor = options.backgroundColor || '#ffffff'
  ctx.save()
  drawRectPath({
    x,
    y,
    ctx,
    width,
    height,
    borderRadius
  })
  ctx.fillStyle = backgroundColor
  ctx.fill()
  ctx.restore()
}

// 绘制文字
let setCtxText = (options) => {
  // ctx canvasContent， x 左上角横坐标， y 左上角纵坐标， width 所在盒子宽度， height 所在盒子高度，
  // fontSize 字体大小， padding 左右边距， text 所绘制的文本 ，字体颜色 color
  console.log(options)
  let ctx = options.ctx || {}
  let x = options.x || 0
  let y = options.y || 0
  let width = options.width || 0
  let height = options.height || 0
  let fontSize = options.fontSize || 13
  let padding = options.padding || 0
  let textAlign = options.textAlign || 'center'
  let textBaseline = options.textBaseline || 'middle'
  let text = options.text || ''
  let fontWeight = options.fontWeight || 'normal'
  let color = options.color || ''
  let maxLine = options.maxLine || ''
  if (text == '') {
    return
  }
  if (fontSize !== '') {
    ctx.font = `${fontSize}px sans-serif`
  }
  if (color !== '') {
    ctx.fillStyle = color
  }
  if (fontWeight == 'bold') {
    options.fontWeight = 'normal'
  }
  ctx.textAlign = textAlign
  ctx.textBaseline = textBaseline
  let textArr = []
  let temp = ''
  for (let i = 0; i < text.length; i++) {
    if (ctx.measureText(temp).width >= (width - 2 * padding)) {
      textArr.push(temp)
      temp = ''
    }
    temp += text[i]
  }
  if (temp != '') {
    textArr.push(temp)
  }
  // 超过限定行数显示 ... 结尾
  if (maxLine != '') {
    if (textArr.length > maxLine) {
      textArr.length = maxLine
      if (textArr.length > 0) {
        let lastLine = textArr[textArr.length - 1]
        let chineseReg = /[\u4e00-\u9fa5]+$/
        if (lastLine.length > 3) {
          if (chineseReg.test(lastLine)) {
            lastLine = lastLine.substr(0, lastLine.length - 1)
          } else {
            lastLine = lastLine.substr(0, lastLine.length - 2)
          }
          lastLine = lastLine + '...'
          textArr[textArr.length - 1] = lastLine
        }
      }
    }
  }
  for (let i = 0; i < textArr.length; i++) {
    let line = y
    let start = x
    let textWidth = width
    if (padding && (2 * padding) < width) {
      start = x + padding
      textWidth = width - (2 * padding)
    }
    // 计算每行文字所在的y轴值
    if (textBaseline == 'top') {
      line = y + (i * fontSize)
    } else if (textBaseline == 'middle') {
      line = y + (height / 2) + ((i + 0.5 - (textArr.length / 2)) * fontSize)
    } else if (textBaseline == 'bottom') {
      line = y + height - ((textArr.length - i - 1) * fontSize)
    }
    if (ctx.textAlign == 'center') {
      ctx.fillText(textArr[i], start + (textWidth / 2), line, textWidth)
    } else if (ctx.textAlign == 'left') {
      ctx.fillText(textArr[i], start, line, textWidth)
    } else if (ctx.textAlign == 'right') {
      ctx.fillText(textArr[i], start + textWidth, line, textWidth)
    }
  }
  // 加粗字体，则将整个文字内容移动1像素后，再次绘制
  if (fontWeight == 'bold') {
    setCtxText(options)
  }
}

// 图片mode，获取图片真实位置及大小
let imgMode = (options) => {
  let {x, y, width, height, imgWidth, imgHeight, mode} = options
  let halfX = x + ((width - imgWidth) / 2)
  let fullX = x + width - imgWidth
  let halfY = y + ((height - imgHeight) / 2)
  let fullY = y + height - imgHeight
  let zoomMode = ['scaleToFill', 'aspectFit', 'aspectFill', 'widthFix', 'heightFix']
  let cutMode = ['top', 'bottom', 'center', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right']
  // 缩放拉伸模式，无需处理
  if (mode == 'scaleToFill') {
    return options
  }
  // 宽高相等并且为缩放模式，则无需处理
  if (imgWidth == imgHeight) {
   if (zoomMode.includes(mode)) {
     return options
   }
  }
  // 裁剪模式,根据不同模式确定该模式下的x,y定位
  if (cutMode.includes(mode)) {
    options.height = imgHeight
    options.width = imgWidth
    if (mode == 'top left') {
    }
    if (mode == 'top') {
      options.x = halfX
    }
    if (mode == 'top right') {
      options.x = fullX
    }
    if (mode == 'left') {
      options.y = halfY
    }
    if (mode == 'center') {
      options.x = halfX
      options.y = halfY
    }
    if (mode == 'right') {
      options.x = fullX
      options.y = halfY
    }
    if (mode == 'bottom left') {
      options.y = fullY
    }
    if (mode == 'bottom') {
      options.x = halfX
      options.y = fullY
    }
    if (mode == 'bottom right') {
      options.x = fullX
      options.y = fullY
    }
    return options
  }
  // 拉伸模式
  if (zoomMode.includes(mode)) {
    // widthFix 和 heightFix 暂时 和 aspectFit 一种表现模式
    if (mode == 'aspectFit' || mode == 'widthFix' || mode == 'heightFix') {
      if (imgWidth > imgHeight) {
        let newHeight = imgHeight * width / imgWidth
        options.height = newHeight
        options.y = y + ((height - newHeight) / 2)
      } else {
        let newWidth = imgWidth * height / imgHeight
        options.width = newWidth
        options.x = x + ((width - newWidth) / 2)
      }
    }
    if (mode == 'aspectFill') {
      if (imgWidth > imgHeight) {
        let newWidth = imgWidth * height / imgHeight
        options.width = newWidth
        options.x = x + ((width - newWidth) / 2)
      } else {
        let newHeight = imgHeight * width / imgWidth
        options.height = newHeight
        options.y = y + ((height - newHeight) / 2)
      }
    }
    return options
  }
  return options
}

// 将css中的数值转换
let unitsConversion = (css) => {
  css.x = rpxToPx(css.x || css.left)
  css.y = rpxToPx(css.y || css.top)
  css.height = rpxToPx(css.height)
  css.width = rpxToPx(css.width)
  css.borderRadius = rpxToPx(css.borderRadius)
  css.borderWidth = rpxToPx(css.borderWidth)
  return css
}

// rpx单位转换为px单位, 返回一个代表px值的数字
let rpxToPx = (str = '') => {
  if (str === Number(str)) {
    return str
  }
  let rpxWidth = 750
  let systemInfo = wx.getSystemInfoSync()
  let windowWidth = systemInfo.windowWidth
  let pxReg = /px$/
  let rpxReg = /rpx$/
  if (rpxReg.test(str)) {
    str = str.replace(rpxReg, '')
    str = Number(str)
    str = windowWidth * str / 750
  } else if (pxReg.test(str)) {
    str = str.replace(pxReg, '')
    str = Number(str)
  } else {
    str = Number(str)
  }
  if (isNaN(str)) {
    return 0
  } else {
    return str
  }
}

// 获取元素属性
let getViewSize = (selector = '') => {
  return new Promise((resolve, reject) => {
    wx.createSelectorQuery().selectAll(selector).boundingClientRect((res) => {
      resolve(res)
    }).exec()
  })
}

// 获取元素列表属性
let getViewListSize = (selectorList = []) => {
  let promiseList = []
  let resultList = []
  for (let i = 0; i < selectorList.length; i++) {
    promiseList.push(getViewSize(selectorList[i]))
  }
  return new Promise((resolve, reject) => {
    Promise.all(promiseList).then((res) => {
      for (let i = 0; i < selectorList.length; i++) {
        const temp = {
          list: res.shift(),
          selector: selectorList[i]
        }
        resultList.push(temp)
      }
      resolve(resultList)
    }).catch((err) => {
      console.log('获取元素属性出错')
      reject(err)
    })
  })
}

module.exports = {
  drawCanvas,
  getViewListSize
}