import { NextPage } from "next"
import axios, { AxiosResponse } from "axios"
import { Form, Input, Button, message } from "antd"
import style from "../styles/css/sign_in.module.scss"
import { useCallback } from "react"

type Err = {
  username: string[]
  password: string[]
  passwordConfirmation: string[]
}

const getErrInfo = (data: Err) => {
  let result = []
  data.username.length > 0 ? result.push(data.username[0]) : null
  data.password.length > 0 ? result.push(data.password[0]) : null
  data.passwordConfirmation.length > 0 ? result.push(data.passwordConfirmation[0]) : null
  return result[0] || "发生错误"
}
const SignUp: NextPage = () => {
  const onFinish = useCallback((values) => {
    axios.post(`/api/v1/users`, values).then(
      () => {
        message.success("注册成功")
        setTimeout(() => {
          window.location.href = "/"
        }, 1000)
      },
      (error) => {
        if (error.response) {
          const response: AxiosResponse = error.response
          const data = error.response.data
          if (response.status === 422) {
            message.error(getErrInfo(data))
          } else if (response.status === 401) {
            message.error("请先登录")
            window.location.href = `/sign_in?returnTo=${encodeURIComponent(window.location.pathname)}`
          }
        }
      }
    )
  }, [])

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo)
  }
  return (
    <>
      <div className={style.cover}>
        <h1> 注册账号</h1>
        <div className={style.content}>
          <Form name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed}>
            <Form.Item name="username" rules={[{ required: true, message: "Please input your username!" }]}>
              <Input placeholder="请输入账号" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: "Please input your password!" }]}>
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
            <Form.Item name="passwordConfirmation" rules={[{ required: true, message: "Please input your password again!" }]}>
              <Input.Password placeholder="请再次输入密码" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" className={style.right} htmlType="submit">
                注册
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  )
}

export default SignUp
