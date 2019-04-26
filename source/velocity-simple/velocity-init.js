const opts = {
  duration: 400
}

// easing 缓动函数
const easing = {
  swing: function (a) {
    return .5 - Math.cos(a * Math.PI) / 2
  },
  Sine: function (p) {
    return 1 - Math.cos(p * Math.PI / 2)
  },
  Circ: function (p) {
    return 1 - Math.sqrt(1 - p * p)
  }
}

/**
 * 2073
 * 获取目标元素的属性值（带单位）
 * @param {any} el 
 * @param {string} property 
 * @returns 
 */
function getPropertyVal (el, property) {
  return window.getComputedStyle(el, null).getPropertyValue(property);
}

/**
 * 2270
 * 设置目标元素的属性值（带单位）
 * @param {any} el 
 * @param {any} property 
 * @param {any} value 
 */
function setPropertyVal (el, property, value, unitType) {
  el.style[property] = value + unitType
}

/**
 * 将属性值的值和单位区分开
 * @param {any} property 
 * @param {any} value 
 * @returns 
 */
function seperateValUnit (property, value) {
  let unitType = '' // 单位
  value = value.toString().replace(/[A-Za-z]+/, (match) => {
    unitType = match
    return ''
  })
  return [value, unitType]
}

/**
 * 主动画
 * @param {any} el 
 * @param {Object} propertiesObj 
 */
function Animation (el, propertiesObj) {
  for (let property in propertiesObj) {
    let startTime = new Date().getTime(),
      currentVal,
      startVal,
      endVal,
      unitType,
      startProperty = getPropertyVal(el, property), // 动画开始值从dom中读取
      endProperty = propertiesObj[property] // 动画结束值直接以对象传入
    
    startVal = seperateValUnit(property, startProperty)[0]
    endVal = seperateValUnit(property, endProperty)[0]
    unitType = seperateValUnit(property, startProperty)[1]
    
    function tick () {
      let currentTime = new Date().getTime()
      const percentComplete = Math.min((currentTime - startTime) / opts.duration, 1)
      if (percentComplete === 1) {
        return setPropertyVal(el, property, endVal, unitType)
      } else {
        currentVal = parseFloat(startVal) + (endVal - startVal) * easing['swing'](percentComplete)
        setPropertyVal(el, property, currentVal, unitType)
        requestAnimationFrame(tick)
      }
    }
    tick()
  }
}
