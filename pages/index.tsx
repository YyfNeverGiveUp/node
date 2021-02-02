import style from "../styles/css/sign_in.module.scss"
import axios, { AxiosResponse } from "axios"
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next"
import { withSession } from "lib/withSession"
import { Form, Input, Button, message } from "antd"
import { useCallback } from "react"

type Params = {
  currentUser: User | null
}

type Err = {
  username: string[]
  passsword: string[]
  passwordConfirmation: string[]
}
const getErrInfo = (data: Err) => {
  let result = []
  data.username.length > 0 ? result.push(data.username[0]) : null
  data.passsword.length > 0 ? result.push(data.passsword[0]) : null
  data.passwordConfirmation.length > 0 ? result.push(data.passwordConfirmation[0]) : null
  return result[0] || "发生错误"
}

const Home: NextPage<Params> = (props) => {
  const { currentUser } = props
  const onFinish = useCallback((values) => {
    console.log("Success:", values)
    axios.post(`/api/v1/sessions`, values).then(
      () => {
        message.success("登录成功")
        setTimeout(() => {
          window.location.href = "/posts"
        }, 1000)
      },
      (error) => {
        if (error.response) {
          const response: AxiosResponse = error.response
          const data = error.response.data
          if (response.status === 422) {
            message.error(getErrInfo(JSON.parse(JSON.stringify(data))))
          } else if (response.status === 401) {
            message.error("请先登录")
            window.location.href = `/sign_in?returnTo=${encodeURIComponent(
              window.location.pathname
            )}`
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
        <img
          src="https://thirdwx.qlogo.cn/mmopen/vi_32/wRVMYXbZepricIoND3JTQU5BA0Zsrhwv5N3RZnyIibpgLweU2L9tgwFib0pt3n0Qy3NrgQwS549dwicFg4jVs7lD0Q/132"
          alt=""
        />
        {currentUser ? (
          <p>
            <a href="/posts">文章列表</a>
          </p>
        ) : (
          <div className={style.content}>
            <Form name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed}>
              <Form.Item
                name="username"
                rules={[{ required: true, message: "Please input your username!" }]}
              >
                <Input placeholder="请输入账号" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "Please input your password!" }]}
              >
                <Input.Password placeholder="请输入密码" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" className={style.right}>
                  登录
                </Button>
                <Button
                  type="primary"
                  danger
                  className={style.right}
                  onClick={() => {
                    window.location.href = "/sign_up"
                  }}
                >
                  去注册
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: GetServerSidePropsContext) => {
    const currentUser = (context.req as any).session.get("currentUser") || null
    return {
      props: {
        currentUser,
      },
    }
  }
)
export default Home
