import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next"
import { UAParser } from "ua-parser-js"
import { getDatabaseConnection } from "lib/getDatabaseConnection"
import { Post } from "src/entity/Post"
import qs from "querystring"
import { usePager } from "../../hooks/usePager"
import { withSession } from "../../lib/withSession"
import { Button } from "antd"
import { LeftOutlined } from "@ant-design/icons"

type Props = {
  posts: Post[]
  count: number
  perPage: number
  page: number
  totalPage: number
  currentUser: User | null
}

const getTime = (time: string) => {
  const index = time.indexOf("T")
  return time.substring(0, index)
}
const getValue = (value: string) => {
  return value.length > 13 ? value.substring(0, 13) + "..." : value
}

const PostsIndex: NextPage<Props> = (props) => {
  const { currentUser, posts, count, page, totalPage } = props
  const { pager } = usePager({ page, totalPage })
  return (
    <>
      <div className="header">
        <LeftOutlined
          onClick={() => {
            window.history.go(-1)
          }}
        />
        {currentUser && (
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              window.location.href = "/posts/new"
            }}
          >
            新增文章
          </Button>
        )}
      </div>
      <div className="posts">
        <header>
          <h1>文章列表</h1>
        </header>
        {posts.map((post) => (
          <div className="onePost" key={post.id}>
            <a href={`/posts/${post.id}`} className="flex" key={post.id}>
              <span className="bold">{getValue(post.title)}</span>
              <span>
                {post.author}&nbsp;&nbsp;&nbsp;{getTime(post.updatedAt.toString())}
              </span>
            </a>
          </div>
        ))}
        <footer>{pager}</footer>
      </div>
      <style jsx>{`
        .header {
          padding: 20px 10px 0;
          font-size: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 32px;
        }
        .posts {
          max-width: 800px;
          margin: 0 auto;
          padding: 16px;
        }
        .posts > header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        .posts > header > h1 {
          margin: 0;
          margin-right: auto;
        }
        .onePost {
          border-bottom: 1px solid #ddd;
          padding: 8px 0;
        }
        .onePost > a {
          border-bottom: none;
          color: #000;
        }
        .onePost .bold {
          font-weight: bold;
        }
        .onePost .flex {
          display: flex;
          justify-content: space-between;
        }
      `}</style>
    </>
  )
}
export default PostsIndex

export const getServerSideProps: GetServerSideProps = withSession(async (context: GetServerSidePropsContext) => {
  const index = context.req.url.indexOf("?")
  const search = context.req.url.substr(index + 1)
  const query = qs.parse(search)
  const page = parseInt(query.page?.toString()) || 1
  const currentUser = (context.req as any).session.get("currentUser") || null
  const connection = await getDatabaseConnection() // 第一次链接能不能用 get
  const perPage = 10
  const [posts, count] = await connection
    .getRepository(Post)
    .createQueryBuilder("post") 
    .orderBy("post.createdAt", "DESC")
    .skip((page - 1) * perPage)
    .take(perPage)
    .getManyAndCount()
  return {
    props: {
      currentUser,
      posts: JSON.parse(JSON.stringify(posts)),
      count: count,
      perPage,
      page,
      totalPage: Math.ceil(count / perPage),
    },
  }
})
