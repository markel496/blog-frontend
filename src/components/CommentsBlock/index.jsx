import React from 'react'
import { useSelector } from 'react-redux'
import axios from '../../axios'
import styles from './CommentsBlock.module.scss'
import { SideBlock } from '../SideBlock'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { ReactComponent as RemoveIcon } from './trash.svg'
import { ReactComponent as EditIcon } from './edit.svg'

import moment from 'moment'
import 'moment/locale/ru'

export const CommentsBlock = ({
  comments,
  setComments,
  setCommentToEdit,
  children,
  postId,
  setPost,
  isLoading = true,
  unchanged
}) => {
  const user = useSelector((state) => state.auth.user)

  const removeComment = async (id) => {
    try {
      await axios.delete(`/comments/${id}`, { data: { postId } })
      setComments(comments.filter((comment) => comment._id !== id))
      setPost((post) => {
        return { ...post, commentsCount: post.commentsCount - 1 }
      })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <SideBlock title="Комментарии">
      <List className={unchanged && styles.list}>
        {(isLoading ? [...Array(5)] : comments)?.map((comment, i) => (
          <React.Fragment key={i}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar
                    alt={comment.autor.fullName}
                    src={
                      comment.autor.avatarUrl &&
                      `${
                        process.env.REACT_APP_API_URL || 'http://localhost:4200'
                      }${comment.autor.avatarUrl}`
                    }
                  />
                )}
              </ListItemAvatar>
              <div className={styles.skeletonWrapper}>
                {isLoading ? (
                  <>
                    <Skeleton variant="text" height={25} width={120} />
                    <Skeleton variant="text" height={18} width={230} />
                  </>
                ) : (
                  <>
                    <div className={styles.userWrapper}>
                      <ListItemText
                        primary={comment.autor.fullName}
                        secondary={moment(comment.createdAt).format('ll в LT')}
                      />
                      {!unchanged && user?._id === comment.autor._id && (
                        <>
                          <button
                            className={styles.editButton}
                            title="Редактировать"
                            onClick={() =>
                              setCommentToEdit({
                                text: comment.text,
                                id: comment._id
                              })
                            }
                          >
                            <EditIcon />
                          </button>
                          <button
                            className={styles.removeButton}
                            title="Удалить"
                            onClick={() => removeComment(comment._id)}
                          >
                            <RemoveIcon />
                          </button>
                        </>
                      )}
                    </div>

                    <ListItemText
                      primary={comment.text.split('\n').map((el, i) => (
                        <Typography key={i} variant="body2">
                          {el}
                        </Typography>
                      ))}
                    />
                  </>
                )}
              </div>
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      {!comments?.length && <p className={styles.text}>Нет комментариев</p>}
      {children}
    </SideBlock>
  )
}
