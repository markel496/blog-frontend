import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import Container from '@mui/material/Container'
import { Header } from './components'
import { Home, FullPost, Registration, AddPost, Login, TagPage } from './pages'
import { fetchMe } from './redux/slices/auth'

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchMe())
  }, [])
  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/tags/:name" element={<TagPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
        </Routes>
      </Container>
    </>
  )
}

export default App
