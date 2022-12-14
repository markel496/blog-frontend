import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { userData, logout } from '../../redux/slices/auth'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'
import styles from './Header.module.scss'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import Divider from '@mui/material/Divider'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

export const Header = () => {
  const dispatch = useDispatch()
  const isAuth = useSelector(userData)
  const user = useSelector((state) => state.auth.user)
  const [open, setOpen] = useState(false)

  const breakpoint = useMediaQuery('(min-width:580px)')

  const onClickLogout = () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      dispatch(logout())
      localStorage.removeItem('blog/token')
      !breakpoint && setOpen(false)
    }
  }

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          {user && (
            <Link className={styles.logo} to="/">
              <span className={styles.logoText}>{user.fullName}</span>
            </Link>
          )}
          <div className={styles.buttons}>
            {isAuth ? (
              breakpoint ? (
                <>
                  <Link to="/add-post">
                    <Button variant="contained">Написать статью</Button>
                  </Link>
                  <Button
                    onClick={onClickLogout}
                    variant="contained"
                    color="error"
                  >
                    Выйти
                  </Button>
                </>
              ) : (
                <>
                  <IconButton
                    classes={{ root: styles.iconBtn }}
                    onClick={() => setOpen(true)}
                  >
                    <MenuIcon />
                  </IconButton>
                </>
              )
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Создать аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
      {isAuth && (
        <SwipeableDrawer
          anchor="right"
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          disableSwipeToOpen
        >
          <div>
            <IconButton onClick={() => setOpen(false)}>
              <ChevronRightIcon />
            </IconButton>
          </div>

          <Divider />
          <List>
            <ListItem>
              <Link to="/add-post">
                <Button onClick={() => setOpen(false)} variant="contained">
                  Написать статью
                </Button>
              </Link>
            </ListItem>
            <ListItem>
              <Button onClick={onClickLogout} variant="contained" color="error">
                Выйти
              </Button>
            </ListItem>
          </List>
        </SwipeableDrawer>
      )}
    </div>
  )
}
