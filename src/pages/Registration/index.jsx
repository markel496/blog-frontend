import { useState, useRef } from 'react'
import { Navigate } from 'react-router-dom'
import axios from '../../axios'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRegister, userData } from '../../redux/slices/auth'

import styles from './Registration.module.scss'
import { ReactComponent as AddIcon } from './add-icon.svg'
import { ReactComponent as RemoveIcon } from './remove-icon.svg'

export const Registration = () => {
  const dispatch = useDispatch()
  const isAuth = useSelector(userData)
  const [avatarUrl, setAvatarUrl] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState(null)
  const inputFileRef = useRef(null)
  const {
    register,
    formState: { errors, isValid },
    handleSubmit
  } = useForm({
    defaultValues: {
      fullName: 'Ваня Маркелов',
      email: 'test@yandex.ru',
      password: '12345'
    },
    mode: 'onSubmit'
  })

  const handleChangeAvatar = async (event) => {
    try {
      const formData = new FormData()
      const file = event.target.files[0]
      formData.append('image', file)
      console.log(formData)
      const { data } = await axios.post('/upload/avatar', formData)
      setAvatarUrl(data.url)
    } catch (err) {
      console.warn(err)
      alert('Ошибка при загрузке файла!')
    }
  }

  const onClickRemoveAvatar = async () => {
    try {
      const startNameIndex = avatarUrl.lastIndexOf('/') + 1
      const fileNameToDeleted = avatarUrl.slice(
        startNameIndex,
        avatarUrl.length
      )
      const { data } = await axios.delete(
        `/uploads/avatars/${fileNameToDeleted}`
      )
      setAvatarUrl('')
    } catch (err) {
      console.warn(err)
    }
  }

  //Будет вызван, если форма заполнена без ошибок
  const onSubmit = async (data) => {
    const res = await dispatch(fetchRegister(data))
    if (!res.payload.hasOwnProperty('token')) {
      return setServerError(res.payload.message)
    }
    localStorage.setItem('blog/token', res.payload.token)
  }

  if (isAuth) {
    return <Navigate to="/" />
  }

  return (
    <Paper elevation={3} classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar
          sx={{ width: 100, height: 100 }}
          src={
            avatarUrl &&
            `${
              process.env.REACT_APP_API_URL || 'http://localhost:4200'
            }${avatarUrl}`
          }
        />
        {!avatarUrl ? (
          <AddIcon onClick={() => inputFileRef.current.click()} />
        ) : (
          <RemoveIcon onClick={onClickRemoveAvatar} />
        )}

        <input
          ref={inputFileRef}
          type="file"
          onChange={handleChangeAvatar}
          accept="image/*,.png,.jpg,.gif,.web"
          hidden
        />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="Полное имя"
          {...register('fullName', {
            required: 'Поле обязательно к заполнению',
            minLength: {
              value: 5,
              message: 'Минимум 5 символов'
            }
          })}
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="E-Mail"
          {...register('email', {
            required: 'Поле обязательно к заполнению',
            pattern: {
              value:
                /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
              message: 'Неверный адрес почты'
            }
          })}
          error={Boolean(errors.email?.message)}
          onChange={() => setServerError(null)}
          helperText={errors.email?.message}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Пароль"
          type={showPassword ? 'text' : 'password'}
          {...register('password', {
            required: 'Поле обязательно к заполнению',
            minLength: {
              value: 5,
              message: 'Минимум 5 символов'
            }
          })}
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Button
          type="submit"
          disabled={!isValid}
          size="large"
          variant="contained"
          fullWidth
        >
          Зарегистрироваться
        </Button>
        {serverError && <p className={styles.error}>{serverError}</p>}
      </form>
    </Paper>
  )
}
