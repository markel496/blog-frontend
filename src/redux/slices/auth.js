import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'

export const fetchRegister = createAsyncThunk(
  'auth/fetchRegister',
  async (params) => {
    try {
      const { data } = await axios.post('/auth/register', params)
      return data
    } catch (err) {
      const { response } = err
      console.log(err)
      return { ...response.data, status: response.status }
    }
  }
)

export const fetchLogin = createAsyncThunk(
  'auth/fetchLogin',
  async (params) => {
    try {
      const { data } = await axios.post('/auth/login', params)
      return data
    } catch (err) {
      const { response } = err
      console.log(err)
      return { ...response.data, status: response.status }
    }
  }
)

export const fetchMe = createAsyncThunk('auth/fetchMe', async () => {
  try {
    const { data } = await axios.get('/auth/me')
    return data
  } catch (err) {
    console.warn(err)
  }
})

const initialState = {
  user: null,
  status: 'loading'
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
    }
  },
  extraReducers: (builder) => {
    //login
    builder.addCase(fetchLogin.pending, (state) => {
      state.user = null
      state.status = 'loading'
    })
    builder.addCase(fetchLogin.fulfilled, (state, { payload }) => {
      state.user = payload.hasOwnProperty('status') ? null : payload
      state.status = 'loaded'
    })
    builder.addCase(fetchLogin.rejected, (state) => {
      state.user = null
      state.status = 'error'
    })
    //me
    builder.addCase(fetchMe.pending, (state) => {
      state.user = null
      state.status = 'loading'
    })
    builder.addCase(fetchMe.fulfilled, (state, { payload }) => {
      state.user = payload
      state.status = 'loaded'
    })
    builder.addCase(fetchMe.rejected, (state) => {
      state.user = null
      state.status = 'error'
    })
    //register
    builder.addCase(fetchRegister.pending, (state) => {
      state.user = null
      state.status = 'loading'
    })
    builder.addCase(fetchRegister.fulfilled, (state, { payload }) => {
      state.user = payload.hasOwnProperty('status') ? null : payload
      state.status = 'loaded'
    })
    builder.addCase(fetchRegister.rejected, (state) => {
      state.user = null
      state.status = 'error'
    })
  }
})

export const userData = (state) => Boolean(state.auth.user)
export const { logout } = authSlice.actions

export default authSlice.reducer
