import React, { Component, Fragment } from 'react'
import ReactDOM from 'react-dom'
import { Table } from 'antd'
import throttle from 'lodash.throttle'

class VirtualTable extends Component {
  static FillNode ({ height, node, marginTop, marginBottom }) {
    if (node) {
      marginTop = marginTop || 0
      marginBottom = marginBottom || 0
      height = height || 0
      return ReactDOM.createPortal(
        <div style={{ height: `${height}px`, marginTop: `${marginTop}px`, marginBottom: `${marginBottom}px` }} />,
        node
      )
    }
    return null
  }
  constructor (props) {
    super(props)
    this.state = {
      startIndex: 0,
      visibleRowCount: 0,
      thresholdCount: 40,
      rowHeight: 0,
      topBlankHeight: 0,
      bottomBlankHeight: 0,
      maxTotalHeight: 15000000
    }
  }

  componentDidMount () {
    this.refScroll = ReactDOM.findDOMNode(this).getElementsByClassName('ant-table-body')[0]

    this.listenEvent = throttle(this.handleScrollEvent2, 50)

    if (this.refScroll) {
      this.refScroll.addEventListener('scroll', this.listenEvent)
      // this.refScroll.addEventListener('mousewheel', this.handleMouseWheel)
    }

    this.createTopFillNode()
    this.createBottomFillNode()
  }

  componentWillUnmount () {
    if (this.refScroll) {
      this.refScroll.removeEventListener('scroll', this.listenEvent)
      // this.refScroll.removeEventListener('mousewheel', this.handleMouseWheel)
    }
  }

  createTopFillNode () {
    if (this.refScroll) {
      const ele = document.createElement('div')
      this.refScroll.insertBefore(ele, this.refScroll.firstChild)
      this.refTopNode = ele
    }
  }

  createBottomFillNode () {
    if (this.refScroll) {
      const ele = document.createElement('div')
      this.refScroll.appendChild(ele)
      this.refBottomNode = ele
    }
  }

  setRowHeight () {
    this.refTable = this.refScroll.getElementsByTagName('table')[0]
    if (this.refTable) {
      const tr = this.refTable.getElementsByTagName('tr')[0]
      const rowHeight = (tr && tr.clientHeight) || 0
      this.state.rowHeight = rowHeight
    }
  }

  handleMouseWheel = e => {
    const evt = e || window.event
    const val = evt.wheelDelta || evt.detail
    if (this.lastWheelDelta === val) {
      this.lastWheelDelta = val
      // this.refScroll.removeEventListener('scroll', this.listenEvent)
      // this.refScroll.addEventListener('scroll', this.listenEvent)
    }
    console.log('val', val)
  }

  handleScrollEvent2 = (e) => {
    e.preventDefault()
    const { dataSource } = this.props
    const { rowHeight, thresholdCount, maxTotalHeight } = this.state
    const { length } = dataSource || []
    if (rowHeight && length > thresholdCount) {
      // if (this.checkValidIntervalTime('lastRunTime', 30)) { // 控制100ms内为合理，防止鼠标持续滑动的情况
        
      // }
      const visibleHeight = this.refScroll.clientHeight // 显示的高度
      const scrollTop = this.refScroll.scrollTop // 滑动的距离
      this.handleBlankHeight(length, rowHeight, maxTotalHeight, visibleHeight, scrollTop) 
    } else {
      this.setRowHeight()
    }
  }

  getIndexByScrollTop(rowHeight, scrollTop) {
    const index = (scrollTop - scrollTop % rowHeight) / rowHeight
    return index
  }

  handleBlankHeight(length, rowHeight, maxTotalHeight, visibleHeight, scrollTop) {
    let oriRowHeight = rowHeight
    let totalHeight = length * rowHeight
    let isBigData = false
    if (totalHeight > maxTotalHeight) {
      isBigData = true
      totalHeight = maxTotalHeight
      rowHeight = totalHeight / length
      scrollTop = scrollTop > maxTotalHeight ? maxTotalHeight : scrollTop
    }
    let topBlankHeight, bottomBlankHeight, startIndex, visibleRowCount
    startIndex = this.getIndexByScrollTop(rowHeight, scrollTop)
    visibleRowCount = Math.ceil(visibleHeight / oriRowHeight)
    topBlankHeight = rowHeight * startIndex
    topBlankHeight = this.getValidValue(topBlankHeight, 0, totalHeight)
    bottomBlankHeight = totalHeight - topBlankHeight - visibleHeight
    bottomBlankHeight = bottomBlankHeight > 0 ? bottomBlankHeight : 0

    const slideUpHeight = Math.abs(topBlankHeight - this.state.topBlankHeight)
    const slideDownHeight = Math.abs(bottomBlankHeight - this.state.bottomBlankHeight)
    
    if (!this.lastSlideUpHeight) {
      this.sameSlideHeightCount = 0
      this.lastSlideUpHeight = slideUpHeight
    } else if (this.lastSlideUpHeight === slideUpHeight) {
      this.sameSlideHeightCount++
    } else {
      this.lastSlideUpHeight = slideUpHeight
      this.sameSlideHeightCount = 0
    }
    

    console.log('===================')
    console.log('oriRowHeight', oriRowHeight)
    console.log('rowHeight', rowHeight)
    console.log('totalHeight', totalHeight)
    console.log('visibleHeight', visibleHeight)
    console.log('scrollTop', scrollTop)
    console.log('topBlankHeight', topBlankHeight)
    console.log('bottomBlankHeight', bottomBlankHeight)
    console.log('startIndex', startIndex)
    console.log('visibleRowCount', visibleRowCount)
    console.log('slideUpHeight', slideUpHeight)
    console.log('slideDownHeight', slideDownHeight)

    let isValid = slideUpHeight >= rowHeight
    isValid = isValid || slideDownHeight >= rowHeight
    isValid = isValid || startIndex === 0
    if (isValid) {
      startIndex = startIndex - 5
      visibleRowCount = visibleRowCount + 5
      this.setState({
        startIndex,
        visibleRowCount,
        topBlankHeight,
        bottomBlankHeight
      })
      if (isBigData && this.sameSlideHeightCount > 3) {
        this.refScroll.scrollTop = scrollTop
        this.sameSlideHeightCount = 0
        console.log('set this.refScroll.scrollTop=', scrollTop)
      }
    }
  }

  checkValidIntervalTime (timeKey, interval = 100) {
    const cur = Date.now()
    if (!this[timeKey] || cur - this[timeKey] >= interval) {
      this[timeKey] = cur
      return true
    }
    return false
  }

  getValidValue (val, min = 0, max = 40) {
    if (val < min) {
      return min
    } else if (val > max) {
      return max
    }
    return val
  }

  render () {
    const { dataSource, ...rest } = this.props
    const { topBlankHeight, bottomBlankHeight, startIndex, visibleRowCount, rowHeight, thresholdCount } = this.state
    const { length } = dataSource || []
    let startIn = this.getValidValue(startIndex, 0, length - visibleRowCount)
    let endIn = startIndex + visibleRowCount
    if (!endIn) { // 初始化渲染数据
      endIn = length > thresholdCount ? thresholdCount : length
    }
    endIn = this.getValidValue(endIn, startIndex, length)
    // console.log('this.state.rowHeight', rowHeight)
    const data = (dataSource || []).slice(startIn, endIn)

    return (
      <Fragment>
        <VirtualTable.FillNode
          height={topBlankHeight}
          node={this.refTopNode}
          marginBottom={-rowHeight}
        />
        <Table
          {...rest}
          dataSource={data}
        />
        <VirtualTable.FillNode
          height={bottomBlankHeight}
          node={this.refBottomNode}
        />
      </Fragment>
    )
  }
}

export default VirtualTable
