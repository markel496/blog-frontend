import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Grid from '@mui/material/Grid'
import { Post } from '../components/Post'
import { TagsBlock } from '../components/TagsBlock'
import { CommentsBlock } from '../components/CommentsBlock'
import {
  fetchPosts,
  fetchTags,
  fetchPopulatePosts
} from '../redux/slices/posts'

import moment from 'moment'
import 'moment/locale/ru'

export const Home = () => {
  const { posts, tags } = useSelector((state) => state.posts)
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const [tabValue, setTabValue] = React.useState(0)

  const isPostsLoading = posts.status === 'loading'
  const isTagsLoading = tags.status === 'loading'

  const changeTab = (event, newValue) => {
    setTabValue(newValue)
    if (newValue === 1) {
      dispatch(fetchPopulatePosts())
    } else {
      dispatch(fetchPosts())
    }
  }

  useEffect(() => {
    dispatch(fetchPosts())
    dispatch(fetchTags())
  }, [])

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={tabValue}
        onChange={changeTab}
        aria-label="basic tabs example"
      >
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
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
                // imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
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
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
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
