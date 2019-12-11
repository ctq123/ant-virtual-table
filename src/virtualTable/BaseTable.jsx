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
      if (rowSelection['selectedRowKeys'] !== undefined) {
        // 警告selectedRowKeys已失效
        if (process.env.NODE_ENV !== 'production') {
          warning(
            false,
            'you should not use `selectedRowKeys` on rowSelection, this field has been rewritten. '
          )
        }
      }
    }
    this.state = {
      selectedRowKeys: [],
      newRowSelection,
    }
  }

  // 处理全选函数
  reOnSelectAll = (selected, selectedRows, changeRows) => {
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

  // 处理onChange函数
  reOnChange = (selectedRowKeys, selectedRows) => {
    if (selectedRowKeys) {
      this.setState({
        selectedRowKeys
      }, () => { 
        this.onChangeCB(selectedRowKeys, selectedRows) 
      })
    }
  }

  render() {
    const { renderSource, dataSource, ...rest } = this.props
    const { selectedRowKeys, newRowSelection } = this.state
    
    newRowSelection && (newRowSelection.selectedRowKeys = selectedRowKeys)

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