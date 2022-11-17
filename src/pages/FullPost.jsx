import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { userData } from '../redux/slices/auth'
import ReactMarkdown from 'react-markdown'
import { useParams } from 'react-router-dom'
import axios from '../axios'
import { useFetching } from '../hooks/useFetching'

import { Post } from '../components/Post'
import { AddComment } from '../components/AddComment'
import { CommentsBlock } from '../components/CommentsBlock'

import moment from 'moment'
import 'moment/locale/ru'

export const FullPost = () => {
  const [post, setPost] = useState()
  const [comments, setComments] = useState()
  const [commentToEdit, setCommentToEdit] = useState({
    text: '',
    id: ''
  })
  const { id } = useParams()
  const isAuth = useSelector(userData)

  const [fetchPost, isPostLoading] = useFetching(async () => {
    const { data } = await axios.get(`posts/${id}`)
    setPost(data)
  }, 'Ошибка при получении статьи')

  const [fetchComments, isCommentsLoading] = useFetching(async () => {
    const { data } = await axios.get(`comments/${id}`)
    setComments(data)
  }, 'Ошибка при получении комментариев')

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [])

  if (isPostLoading) return <Post isLoading={isPostLoading} isFullPost />

  return (
    <>
      <Post
        id={post._id}
        title={post.title}
        imageUrl={post.imageUrl}
        user={post.user}
        createdAt={moment(post.createdAt).format('ll в LT')}
        viewsCount={post.viewsCount}
        commentsCount={post.commentsCount}
        tags={post.tags}
        isFullPost
      >
        <ReactMarkdown children={post.text} />
      </Post>
      <CommentsBlock
        comments={comments}
        setComments={setComments}
        setCommentToEdit={setCommentToEdit}
        isLoading={isCommentsLoading}
        postId={id}
        setPost={setPost}
      >
        {isAuth ? (
          <AddComment
            setComments={setComments}
            postId={id}
            setPost={setPost}
            textToEdit={commentToEdit.text}
            id={commentToEdit.id}
            setCommentToEdit={setCommentToEdit}
          />
        ) : (
          <p style={{ margin: 0, padding: '0 16px 8px', textAlign: 'center' }}>
            Войдите или зарегестрируйтесь, чтобы написать комментарий
          </p>
        )}
      </CommentsBlock>
    </>
  )
}
