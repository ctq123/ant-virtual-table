# ant-virtual-table

[English](./README-en_EN.md) | 简体中文

这是一个ant的虚拟表格，用于解决大数据渲染时页面卡顿的问题，本组件是对ant.desigin中Table组件进行一层封装，属性完全与原组件Table保持一致 [AntDesign Table](https://ant.design/components/table-cn/)，可以让你像使用普通table一样使用虚拟table。例子中处理渲染1000万条数据，页面也非常流畅。

## 设计说明
考虑到兼容性问题，内部通过监听Table的滚动事件判断滑动行的位置，没有采用H5新特性IntersectionObserver。因此兼容性问题是比较好的。另外组件引入loash的throttle处理抖动问题，目前没有采用raf

## React ant-virtual-table
[![Build Status](https://travis-ci.org/ctq123/ant-virtual-table.svg?branch=master&foo=bar)](https://travis-ci.org/ctq123/ant-virtual-table)
[![NPM version](https://img.shields.io/badge/npm-v5.7.1-green.svg?style=flat)](https://www.npmjs.com/package/ant-virtual-table)

# install
npm install ant-virtual-table --save-dev
# Usage

## 例子 
[!在线demo](https://codesandbox.io/s/antdxunibiao-demo-rj5qc?file=/index.js)
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

为降低迁移成本，属性与antd的Table完全保持一致，暂时没有自身独特的属性
<!-- 属性 | 描述 | 类型 | 默认值 | 是否必填
---|---|---|---|--
dataSource | 数据源 | array |  | 否 -->

# 注意
**目前暂不支持内嵌tree等复杂的表单结构，任何复杂的表单结构都不建议使用，后续跟进当中...**
