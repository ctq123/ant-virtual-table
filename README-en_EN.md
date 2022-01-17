# ant-virtual-table

## Tip: No longer maintained, antd4 has an alternative

English | [简体中文](./README.md) 

This is an ant.design virtual table, which is used to solve the problem of page jamming during big data rendering. This component encapsulates the Table component in ant.desigin and its properties are completely consistent with the original component Table [AntDesign Table](https://ant.design/components/table-cn/), it allows you to use a virtual table like a normal table. The example handles rendering 10 million pieces of data, and the page is very smooth. [online demo](https://codesandbox.io/s/antdxunibiao-demo-rj5qc?file=/index.js)

## Design Notes
Considering the compatibility issue, the internal scrolling event of the Listening Table determines the position of the sliding line, and does not adopt the new H5 feature IntersectionObserver. Therefore the compatibility issue is better. In addition, the component introduces the loose handle of the loash to deal with the jitter problem. Currently, raf is not used.

## React ant-virtual-table
[![Build Status](https://travis-ci.org/ctq123/ant-virtual-table.svg?branch=master&foo=bar)](https://travis-ci.org/ctq123/ant-virtual-table)
[![NPM version](https://img.shields.io/badge/npm-v5.7.1-green.svg?style=flat)](https://www.npmjs.com/package/ant-virtual-table)

# install
npm install ant-virtual-table --save-dev
# Usage

## demo
![image](https://github.com/ctq123/ant-virtual-table/blob/master/example1.gif)
```
import React, { Component, Fragment } from 'react'
import { VirtualTable } from 'ant-virtual-table'
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
  for (let i = 0; i < 10000000; i++) {
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
```

# Prop Types

The attribute is consistent with the ant.design Table, and there are no unique attributes for the time being.
