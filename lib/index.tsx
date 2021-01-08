import { UploadState } from "antd/lib/upload/interface"

export type b = string

function test<T extends b>(a: T): number {
  return a.length
}

interface Test {
  <T>(name: T): T
}

function a<T>(name: T): T {
  return name
}

a(1)

class PP<T = string, U = any> {
  num: T
  constructor(num: T) {
    this.num = num
  }
  add: (x: T, y: U) => T
}

const c = new PP("123")

interface Person {
  name: string
  age: number
  gender?: string // 可选属性
  // 任意属性any，一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集
  [key: string]: string | number | Function
}

let Tom: Person = {
  name: "tom",
  age: 11,
  gender: "男",
  play() {
    console.log("打篮球")
  },
}


interface YYF<T> {
(b: T) : string
}
// type YYF<T> = (b: T) => any

type Props = {
  title:string
}

let fn2: YYF<Props> = (a) => {

  return ''
}


function getValue<T extends Object>(o: T, key: keyof T): T[keyof T] {
  return o[key]
}