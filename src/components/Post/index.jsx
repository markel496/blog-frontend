import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined'
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import { fetchDeletePost } from '../../redux/slices/posts'
import styles from './Post.module.scss'
import { UserInfo } from '../UserInfo'
import { PostSkeleton } from './Skeleton'

export const Post = ({
  id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  isEditable
}) => {
  const dispatch = useDispatch()
  if (isLoading) {
    return <PostSkeleton />
  }
  const onClickRemove = () => {
    try {
      if (window.confirm('Вы действительно хотите удалить статью?')) {
        console.log(id)
        dispatch(fetchDeletePost(id))
      }
    } catch (err) {
      console.log(err)
      alert('Не удалось удалить статью!')
    }
  }

  return (
    <Paper elevation={3}>
      <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
        {isEditable && (
          <div className={styles.editButtons}>
            <Link to={`/posts/${id}/edit`}>
              <IconButton color="primary">
                <EditIcon />
              </IconButton>
            </Link>
            <IconButton onClick={onClickRemove} color="secondary">
              <DeleteIcon />
            </IconButton>
          </div>
        )}
        {imageUrl && (
          <img
            className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
            src={`${
              process.env.REACT_APP_API_URL || 'http://localhost:4200'
            }${imageUrl}`}
            alt={title}
          />
        )}
        <div className={styles.wrapper}>
          <UserInfo {...user} additionalText={createdAt} />
          <div className={styles.indention}>
            <h2
              className={clsx(styles.title, { [styles.titleFull]: isFullPost })}
            >
              {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
            </h2>
            <ul className={styles.tags}>
              {tags.map(
                (name) =>
                  name && (
                    <li key={name}>
                      <Link to={`/tags/${name}`}>#{name}</Link>
                    </li>
                  )
              )}
            </ul>
            {children && <div className={styles.content}>{children}</div>}
            <ul className={styles.postDetails}>
              <li title="просмотры">
                <EyeIcon />
                <span>{viewsCount}</span>
              </li>
              <li title="комментарии">
                <CommentIcon />
                <span>{commentsCount}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Paper>
  )
}
