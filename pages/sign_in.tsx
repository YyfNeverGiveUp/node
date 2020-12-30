import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next"
import axios from "axios"
import { withSession } from "../lib/withSession"
import { User } from "../src/entity/User"
import { useForm } from "../hooks/useForm"
import qs from "querystring"
import { Form, Input, Button } from "antd"
import style from "../styles/css/sign_in.module.scss"

const SignIn: NextPage<{ user: User }> = (props) => {
  const { form } = useForm({
    initFormData: { username: "", password: "" },
    fields: [
      { label: "用户名", type: "text", key: "username" },
      { label: "密码", type: "password", key: "password" },
    ],
    buttons: <button type="submit">登录</button>,
    submit: {
      request: (formData) => axios.post(`/api/v1/sessions`, formData),
      success: () => {
        window.alert("登录成功")
        const query = qs.parse(window.location.search.substr(1))
        console.log(query)
        window.location.href = "/posts"
      },
    },
  })

  const onFinish = (values: any) => {
    console.log("Success:", values)
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo)
  }
  return (
    <>
      {/* {props.user && <div>当前登录用户为 {props.user.username}</div>}
      <h1>登录</h1>
      {form} */}
      <div className={style.content}>
        <Form name="basic" initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Form.Item label="账号" name="username" rules={[{ required: true, message: "Please input your username!" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="密码" name="password" rules={[{ required: true, message: "Please input your password!" }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className={style.right}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default SignIn

export const getServerSideProps: GetServerSideProps = withSession(async (context: GetServerSidePropsContext) => {
  // @ts-ignore
  const user = context.req.session.get("currentUser")
  return {
    props: {
      user: JSON.parse(JSON.stringify(user || "")),
    },
  }
})
