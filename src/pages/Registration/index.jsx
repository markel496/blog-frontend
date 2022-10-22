import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
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

export const Registration = () => {
  const dispatch = useDispatch()
  const isAuth = useSelector(userData)
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState(null)
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      fullName: 'Ваня Маркелов',
      email: 'test@yandex.ru',
      password: '12345',
    },
    mode: 'onSubmit',
  })

  //Будет вызван, если форма заполнена без ошибок
  const onSubmit = async (data) => {
    const res = await dispatch(fetchRegister(data))
    if (!res.payload.hasOwnProperty('token')) {
      console.log(res)
      return setServerError(res.payload.message)
    }
    localStorage.setItem('blog/token', res.payload.token)
    // reset() // Очищаю поля формы
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
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="Полное имя"
          {...register('fullName', {
            required: 'Поле обязательно к заполнению',
            minLength: {
              value: 5,
              message: 'Минимум 5 символов',
            },
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
              message: 'Неверный адрес почты',
            },
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
          // autoComplete="current-password"
          {...register('password', {
            required: 'Поле обязательно к заполнению',
            minLength: {
              value: 5,
              message: 'Минимум 5 символов',
            },
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
            ),
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
