import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import { Post } from '../components/Post'
import { fetchPostsByTag } from '../redux/slices/posts'
import { CommentsBlock } from '../components/CommentsBlock'

import moment from 'moment'
import 'moment/locale/ru'

export const TagPage = () => {
  const { posts } = useSelector((state) => state.posts)
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const { name } = useParams()

  const isPostsLoading = posts.status === 'loading'

  useEffect(() => {
    dispatch(fetchPostsByTag(name))
  }, [])

  return (
    <>
      <h1>#{name}</h1>
      <Grid container spacing={4}>
        <Grid xs={8} item>
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
                commentsCount={3}
                tags={post.tags}
                isEditable={user?._id === post?.user._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Вася Пупкин',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg'
                },
                text: 'Это тестовый комментарий'
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg'
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top'
              }
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  )
}
