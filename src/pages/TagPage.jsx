import { useState, useEffect } from 'react'
import axios from '../axios'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useFetching } from '../hooks/useFetching'
import Grid from '@mui/material/Grid'
import { Post } from '../components/Post'
import { fetchPostsByTag } from '../redux/slices/posts'
import { CommentsBlock } from '../components/CommentsBlock'
import useMediaQuery from '@mui/material/useMediaQuery'

import moment from 'moment'
import 'moment/locale/ru'

export const TagPage = () => {
  const { posts } = useSelector((state) => state.posts)
  const user = useSelector((state) => state.auth.user)
  const [comments, setComments] = useState()
  const dispatch = useDispatch()
  const { name } = useParams()

  const breakpoint = useMediaQuery('(min-width:992px)')

  const isPostsLoading = posts.status === 'loading'

  const [fetchComments, isCommentsLoading] = useFetching(async () => {
    const { data } = await axios.get(`comments/tag/${name}`)
    setComments(data)
  }, 'Ошибка при получении комментариев')

  useEffect(() => {
    dispatch(fetchPostsByTag(name))
    fetchComments()
  }, [name])

  return (
    <>
      <h1>#{name}</h1>
      <Grid container spacing={4}>
        <Grid xs={breakpoint ? 8 : 12} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((post, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={isPostsLoading} />
            ) : (
              <Post
                key={post._id}
                id={post._id}
                title={post.title}
                imageUrl={post.imageUrl}
                user={post.user}
                createdAt={moment(post.createdAt).format('LLL')}
                viewsCount={post.viewsCount}
                commentsCount={post.commentsCount}
                tags={post.tags}
                isEditable={user?._id === post?.user._id}
              />
            )
          )}
        </Grid>
        {breakpoint && (
          <Grid xs={4} item>
            <CommentsBlock
              unchanged
              comments={comments}
              isLoading={isCommentsLoading}
            />
          </Grid>
        )}
      </Grid>
    </>
  )
}
