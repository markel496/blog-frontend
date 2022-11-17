import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get('/posts')
  return data
})

export const fetchPopulatePosts = createAsyncThunk(
  'posts/fetchPopulatePosts',
  async () => {
    const { data } = await axios.get('/populate')
    return data
  }
)

export const fetchPostsByTag = createAsyncThunk(
  'posts/fetchPostsByTag',
  async (name) => {
    const { data } = await axios.get(`/posts/tags/${name}`)
    return data
  }
)

export const fetchDeletePost = createAsyncThunk(
  'posts/fetchDeletePost',
  async (id) => {
    const { data } = await axios.delete(`/posts/${id}`)
    console.log(data)
  }
)

const initialState = {
  posts: {
    items: [],
    status: 'loading'
  }
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //posts
    builder.addCase(fetchPosts.pending, (state) => {
      state.posts.items = []
      state.posts.status = 'loading'
    })
    builder.addCase(fetchPosts.fulfilled, (state, { payload }) => {
      state.posts.items = payload
      state.posts.status = 'loaded'
    })
    builder.addCase(fetchPosts.rejected, (state) => {
      state.posts.items = []
      state.posts.status = 'error'
    })
    //populate posts
    builder.addCase(fetchPopulatePosts.pending, (state) => {
      state.posts.items = []
      state.posts.status = 'loading'
    })
    builder.addCase(fetchPopulatePosts.fulfilled, (state, { payload }) => {
      state.posts.items = payload
      state.posts.status = 'loaded'
    })
    builder.addCase(fetchPopulatePosts.rejected, (state) => {
      state.posts.items = []
      state.posts.status = 'error'
    })
    //posts by tag
    builder.addCase(fetchPostsByTag.pending, (state) => {
      state.posts.items = []
      state.posts.status = 'loading'
    })
    builder.addCase(fetchPostsByTag.fulfilled, (state, { payload }) => {
      state.posts.items = payload
      state.posts.status = 'loaded'
    })
    builder.addCase(fetchPostsByTag.rejected, (state) => {
      state.posts.items = []
      state.posts.status = 'error'
    })
    //deletePost
    builder.addCase(fetchDeletePost.pending, (state, { meta }) => {
      state.posts.items = state.posts.items.filter(
        (post) => post._id !== meta.arg
      )
    })
  }
})

export default postsSlice.reducer
