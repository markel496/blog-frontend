import { useEffect, useState } from 'react'
import axios from '../axios'
import { useDispatch, useSelector } from 'react-redux'
import { useFetching } from '../hooks/useFetching'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Grid from '@mui/material/Grid'
import { Post } from '../components/Post'
import { TagsBlock } from '../components/TagsBlock'
import { CommentsBlock } from '../components/CommentsBlock'
import { fetchPosts, fetchPopulatePosts } from '../redux/slices/posts'

import moment from 'moment'
import 'moment/locale/ru'

export const Home = () => {
  const { posts } = useSelector((state) => state.posts)
  const user = useSelector((state) => state.auth.user)
  const [tags, setTags] = useState()
  const [comments, setComments] = useState()
  const dispatch = useDispatch()
  const [tabValue, setTabValue] = useState(0)

  const isPostsLoading = posts.status === 'loading'

  const [fetchTags, isTagsLoading] = useFetching(async () => {
    const { data } = await axios.get('/tags')
    setTags(data)
  }, 'Ошибка при получении статьи')

  const [fetchComments, isCommentsLoading] = useFetching(async () => {
    const { data } = await axios.get('/comments')
    setComments(data)
  }, 'Ошибка при получении комментариев')

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
    fetchTags()
    fetchComments()
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
                user={post.user}
                createdAt={moment(post.createdAt).format('ll в LT')}
                viewsCount={post.viewsCount}
                commentsCount={post.commentsCount}
                tags={post.tags}
                isEditable={user?._id === post?.user._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags} isLoading={isTagsLoading} />
          <CommentsBlock
            unchanged
            comments={comments}
            isLoading={isCommentsLoading}
          />
        </Grid>
      </Grid>
    </>
  )
}
