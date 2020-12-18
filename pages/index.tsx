import Link from "next/link"
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next"
import { withSession } from "lib/withSession"


type Params = {
  currentUser:User | null
}

const Home: NextPage <Params> = (props) => {
  const { currentUser } = props
  console.log(currentUser)
  return (
    <>
      <div className="cover">
        <img src="/logo.png" alt="" />
        <h1>个人博客</h1>
        {currentUser ? (
          <p>
            <Link href="/posts">
              <a>文章列表</a>
            </Link>
          </p>
        ) : (
          <p>
            <Link href="/sign_in">
              <a>登录</a>
            </Link>
          </p>
        )}
      </div>
      <style jsx>{`
        .cover {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }
        .cover > img {
          width: 120px;
          height: 120px;
        }
      `}</style>
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
