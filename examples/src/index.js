import React, { Component, Fragment } from 'react'
import { render } from 'react-dom'
import { VirtualTable } from '../../src'
import 'antd/dist/antd.css'

const columns = [
  {
    title: '序号',
    dataIndex: 'id',
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

function generateData () {
  const res = []
  const names = ['Tom', 'Marry', 'Jack', 'Lorry', 'Tanken', 'Salla']
  const sexs = ['male', 'female']
  for (let i = 0; i < 100000; i++) {
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

const dataSource = generateData()

class App extends Component {
  render () {
    return (
      <Fragment>
        <VirtualTable
          columns={columns}
          dataSource={dataSource}
          rowKey='id'
          pagination={{ pageSize: 40 }}
          scroll={{ y: 400 }}
          bordered
        />
      </Fragment>
    )
  }
}

render(<App />, document.getElementById('root'))
