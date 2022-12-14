import React, { useEffect, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { userData } from '../../redux/slices/auth'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import useMediaQuery from '@mui/material/useMediaQuery'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import SimpleMDE from 'react-simplemde-editor'

import 'easymde/dist/easymde.min.css'
import styles from './AddPost.module.scss'
import axios from '../../axios'

export const AddPost = () => {
  const navigate = useNavigate()
  const isAuth = useSelector(userData)

  const { id } = useParams()

  const [fields, setFields] = React.useState({
    title: '',
    text: '',
    tags: '',
    imageUrl: ''
  })

  const inputFileRef = useRef(null)

  const isEditing = Boolean(id)

  const breakpoint = useMediaQuery('(min-width:490px)')

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData()
      const file = event.target.files[0]
      formData.append('image', file)
      const { data } = await axios.post('/upload', formData)
      setFields({ ...fields, imageUrl: data.url })
    } catch (err) {
      console.warn(err)
      alert('Ошибка при загрузке файла!')
    }
  }

  const onClickRemoveImage = async () => {
    try {
      const startNameIndex = fields.imageUrl.lastIndexOf('/') + 1
      const fileNameToDeleted = fields.imageUrl.slice(
        startNameIndex,
        fields.imageUrl.length
      )
      const { data } = await axios.delete(`/uploads/${fileNameToDeleted}`)
      console.log(data)
      setFields({ ...fields, imageUrl: '' })
    } catch (err) {
      console.warn(err)
    }
  }

  const onChange = useCallback((text) => {
    setFields((fields) => ({ ...fields, text }))
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields)
      console.log(data)
      const _id = isEditing ? id : data._id
      navigate(`/posts/${_id}`)
    } catch (err) {
      console.warn(err)
      alert('Не удалось создать статью!')
    }
  }

  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setFields({ ...data, tags: data.tags.join(' ') })
        })
        .catch((err) => {
          console.warn(err)
          alert('Не удалось получить статью.')
        })
    }
  }, [])

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      minHeight: '200px',
      placeholder: 'Введите текст...',
      status: false,
      hideIcons: ['fullscreen', 'side-by-side', 'preview']
    }),
    []
  )

  if (!localStorage.getItem('blog/token') && !isAuth) {
    return <Navigate to="/" />
  }

  return (
    <form style={{ marginBottom: 30 }} onSubmit={(e) => onSubmit(e)}>
      <Paper elevation={3} style={{ padding: 30 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => inputFileRef.current.click()}
        >
          {fields.imageUrl ? 'Изменить картинку' : 'Загрузить картинку'}
        </Button>
        <input
          ref={inputFileRef}
          type="file"
          onChange={handleChangeFile}
          accept="image/*,.png,.jpg,.gif,.web"
          hidden
        />
        {fields.imageUrl && (
          <>
            <Button
              variant="contained"
              color="error"
              style={{ marginLeft: 10 }}
              onClick={onClickRemoveImage}
            >
              Удалить
            </Button>
            <img
              className={styles.image}
              src={`${
                process.env.REACT_APP_API_URL || 'http://localhost:4200'
              }${fields.imageUrl}`}
              alt="Uploaded"
            />
          </>
        )}
        <br />
        <br />
        <TextField
          classes={{ root: styles.title }}
          variant="standard"
          placeholder={breakpoint ? 'Заголовок статьи...' : 'Заголовок'}
          fullWidth
          value={fields.title}
          onChange={(e) => setFields({ ...fields, title: e.target.value })}
          autoComplete="off"
        />
        <TextField
          classes={{ root: styles.tags }}
          variant="standard"
          placeholder="Тэги через пробел без #"
          fullWidth
          value={fields.tags}
          onChange={(e) => setFields({ ...fields, tags: e.target.value })}
          autoComplete="off"
        />
        <SimpleMDE
          className={styles.editor}
          value={fields.text}
          onChange={onChange}
          options={options}
        />
        <div className={styles.buttons}>
          <Button type="submit" size="large" variant="contained">
            {isEditing ? 'Сохранить' : 'Опубликовать'}
          </Button>
          <Link to="/">
            <Button size="large">Отмена</Button>
          </Link>
        </div>
      </Paper>
    </form>
  )
}
