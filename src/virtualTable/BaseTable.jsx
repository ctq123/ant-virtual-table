import React, { PureComponent } from 'react'
import { Table } from 'antd'

class BaseTable extends PureComponent {
  constructor(props) {
    super(props)
    const { rowSelection } = props
    const newRowSelection = rowSelection ? { ...rowSelection } : null
    if (rowSelection) {
      const { onSelectAll, onChange } = rowSelection
      if (onSelectAll) {
        newRowSelection.onSelectAll = this.reOnSelectAll
        // 原方法保存下来
        this.onSelectAllCB = onSelectAll
      }
      if (onChange) {
        newRowSelection.onChange = this.reOnChange
        // 原方法保存下来
        this.onChangeCB = onChange
      }
    }
    this.state = {
      selectedRowKeys: [],
      newRowSelection,
    }
  }

  reOnSelectAll = (selected, selectedRows, changeRows) => {// 处理全选函数
    const { dataSource, rowKey } = this.props
    if (selected) {
      const selectedRowKeys = dataSource.map(item => item[rowKey])
      this.setState({
        selectedRowKeys
      }, () => { 
        this.onSelectAllCB(selected, dataSource, changeRows) 
      })
    } else {
      this.setState({
        selectedRowKeys: []
      }, () => { 
        this.onSelectAllCB(selected, [], dataSource) 
      })
    }
  }

  reOnChange = (selectedRowKeys, selectedRows) => {// 处理onChange函数
    if (selectedRowKeys) {
      this.setState({
        selectedRowKeys
      }, () => { 
        this.onChangeCB(selectedRowKeys, selectedRows) 
      })
    }
  }

  render() {
    const { renderSource, dataSource, rowSelection, ...rest } = this.props
    const { selectedRowKeys, newRowSelection } = this.state
    
    if (newRowSelection) {
      /**需要兼容用户传递进来的selectedRowKeys，
       * 用户selectedRowKeys优先级高于内部selectedRowKeys */
      newRowSelection.selectedRowKeys = rowSelection['selectedRowKeys'] || selectedRowKeys
    }

    return (
      <Table
        {...rest}
        rowSelection={newRowSelection}
        dataSource={renderSource}
      />
    )
  }

}

export default BaseTable