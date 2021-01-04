import React, {useCallback} from 'react';
import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import {getDatabaseConnection} from '../../lib/getDatabaseConnection';
import {Post} from '../../src/entity/Post';
import marked from 'marked';
import {withSession} from '../../lib/withSession';
import axios from 'axios';
import {useRouter} from 'next/router';
import Header from '../../components/header'
import { Button, message } from "antd"

type Props = {
  id: number;
  post: Post;
  currentUser: User | null;
}

const getTime = (time: string) => {
  const index = time.indexOf("T")
  return time.substring(0, index)
}
const postsShow: NextPage<Props> = (props) => {
  const {post, currentUser, id} = props;
  const router = useRouter()
  const onRemove = useCallback(() => {
    axios.delete(`/api/v1/posts/${id}`).then(() => {
      message.success("删除成功")
      router.push('/posts')
    }, () => {
      message.error("删除失败")
    });
  }, [id]);
  return (
    <>
      <Header title="文章详情" />
      <div className="wrapper">
        <header>
          <h2>{post.title}</h2>
        </header>
        <article className="markdown-body" dangerouslySetInnerHTML={{ __html: marked(post.content) }}></article>
        <div className="footer">
          <span>{post.author}</span>&nbsp;&nbsp;
          <span>{getTime(post.createdAt.toString())}</span>
        </div>
        {currentUser && (
          <p className="actions">
            <Button type="primary" danger onClick={() => (window.location.href = `/posts/${post.id}/edit`)}>
              编辑
            </Button>
            &nbsp; &nbsp; &nbsp;
            <Button type="primary" className="editButton" onClick={onRemove}>
              删除
            </Button>
          </p>
        )}
      </div>
      <style jsx>{`
        .actions {
          text-align: right;
        }
        .editButton {
          display: inline-block;
          margin-right: 20px !important;
        }
        .actions > * {
          margin: 4px;
        }
        .actions > *:first-child {
          margin-left: 0;
        }
        .wrapper {
          max-width: 800px;
          margin: 16px auto;
          padding: 0 16px;
        }
        h2 {
          padding-bottom: 16px;
          border-bottom: 1px solid #666;
        }
        .footer {
          display: block;
          height: 30px;
          text-align: right;
          width: 100%;
        }
      `}</style>
    </>
  )
};

export default postsShow;

export const getServerSideProps: GetServerSideProps<any, { id: string }> = withSession(
  async (context: GetServerSidePropsContext) => {
    const connection = await getDatabaseConnection();
    const id = context.params.id;
    const post = await connection.manager.findOne('Post', id);
    const currentUser = (context.req as any).session.get('currentUser') || null;
    return {
      props: {
        id: parseInt(id.toString()),
        post: JSON.parse(JSON.stringify(post)),
        currentUser
      }
    };
  });

