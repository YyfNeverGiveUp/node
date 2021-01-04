import { GetServerSideProps, NextPage } from "next"
import { useForm } from "../../../hooks/useForm"
import axios from "axios"
import { getDatabaseConnection } from "../../../lib/getDatabaseConnection"
import { Button, message } from "antd"
import Header from "../../../components/header"

type Props = {
  id: number
  post: Post
}
const PostsEdit: NextPage<Props> = (props) => {
  const { post, id } = props
  const { form } = useForm({
    initFormData: { title: post.title, content: post.content },
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
      request: (formData) => axios.patch(`/api/v1/posts/${id}`, { ...formData, id }),
      success: () => {
        message.error("提交成功")
        window.history.go(-1)
      },
    },
  })
  return (
    <div className="postsNew">
      <Header title="修改文章" />
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

export default PostsEdit

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params
  const connection = await getDatabaseConnection()
  const post = await connection.manager.findOne("Post", id)
  return {
    props: {
      id: parseInt(id.toString()),
      post: JSON.parse(JSON.stringify(post)),
    },
  }
}
