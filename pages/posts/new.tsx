import { NextPage } from "next"
import axios from "axios"
import { useForm } from "../../hooks/useForm"
import Header from "../../components/header"
import { Button, message } from "antd"

const PostsNew: NextPage = () => {
  const { form } = useForm({
    initFormData: { title: "", content: "" },
    fields: [
      { label: "标题", type: "text", key: "title" },
      { label: "内容", type: "textarea", key: "content" },
    ],
    buttons: (
      <Button type="primary" htmlType="submit">
        提交
      </Button>
    ),
    submit: {
      request: (formData) => axios.post(`/api/v1/posts`, formData),
      success: () => {
        message.error("提交成功")
        window.location.href = "/posts"
      },
    },
  })
  return (
    <div className="postsNew">
      <Header title="新增文章" />
      <div className="form-wrapper">{form}</div>
      <style jsx global>{`
        .form-wrapper {
          padding: 16px;
        }
        .postsNew .field-content textarea {
          height: 20em;
          resize: none;
        }
        .postsNew .label-text {
          width: 4em;
          text-align: right;
        }
        .postsNew .actions {
          text-align: center;
          background: #ddd;
          padding: 4px 0;
        }
      `}</style>
    </div>
  )
}

export default PostsNew
