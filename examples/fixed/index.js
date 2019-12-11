import React, { Component, Fragment } from 'react'
import { render } from 'react-dom'
import { VirtualTable } from '../../src'
import { Pagination } from 'antd'
import 'antd/dist/antd.css'

const columns = [
  {
    title: '序号',
    dataIndex: 'id',
    fixed: 'left',
    width: 100
  },
  {
    title: '姓名',
    dataIndex: 'name',
    width: 150
  },
  {
    title: '年龄',
    dataIndex: 'age',
    width: 100
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 100,
    render: (text) => {
      return text === 'male' ? '男' : '女'
    }
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address'
  }
]

function generateData (count) {
  const res = []
  const names = ['Tom', 'Marry', 'Jack', 'Lorry', 'Tanken', 'Salla']
  const sexs = ['male', 'female']
  for (let i = 0; i < count; i++) {
    let obj = {
      id: i,
      name: names[i % names.length] + i,
      sex: sexs[i % sexs.length],
      age: 15 + Math.round(10 * Math.random()),
      address: '浙江省杭州市西湖区华星时代广场2号楼'
    }
    res.push(obj)
  }
  return res
}

const dataSource = generateData(100)

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      pageNumber: 1,
      objectsPerPage: 10,
      list: dataSource
    }
  }

  // 改变页面数字第几页发起的请求
  onPageChange (pageNumber) {
    this.setState({
      pageNumber
    })
  }

  // 改变页面显示条数发起的请求
  onShowSizeChange (current, objectsPerPage) {
    const list = dataSource.slice((current - 1) * objectsPerPage, objectsPerPage)
    this.setState({
      list,
      pageNumber: current,
      objectsPerPage
    })
  }

  render () {
    const { list = [] } = this.state
    return (
      <Fragment>
        <div style={{ 'height': 350, 'width': '100%' }} />
        <VirtualTable
          columns={columns}
          dataSource={list}
          rowKey='id'
          pagination={false}
          scroll={{ y: 400 }}
          bordered
        />
        <Pagination
          size='small'
          total={list.length}
          current={this.state.pageNumber}
          pageSize={this.state.objectsPerPage}
          showSizeChanger
          pageSizeOptions={['10', '20', '50', '1000']}
          onShowSizeChange={this.onShowSizeChange.bind(this)}
          onChange={this.onPageChange.bind(this)}
          showTotal={() => `共 ${list.length} 条`}
        />
      </Fragment>
    )
  }
}

render(<App />, document.getElementById('root'))
