import { useEffect, useState, useRef } from 'react'
import axios from '../../axios'

import styles from './AddComment.module.scss'
import TextField from '@mui/material/TextField'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'

export const AddComment = ({
  setComments,
  postId,
  setPost,
  textToEdit,
  id,
  setCommentToEdit
}) => {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  const addComment = async () => {
    try {
      //send comment
      const { data } = !textToEdit
        ? await axios.post('/comments', {
            text: value.replace(/\s{2,}/g, ' ').trim(),
            postId: postId
          })
        : await axios.patch(`/comments/${id}`, {
            text: value.replace(/\s{2,}/g, ' ').trim()
          })
      console.log(data)
      textToEdit &&
        setCommentToEdit({
          text: '',
          id: ''
        })
      //get comments
      axios
        .get(`comments/${postId}`)
        .then((res) => {
          setComments(res.data)
          //Увеличиваю кол-во комментариев
          !textToEdit &&
            setPost((post) => {
              return { ...post, commentsCount: post.commentsCount + 1 }
            })
        })
        .catch((err) => {
          console.warn(err)
        })
    } catch (err) {
      console.warn(err)
      alert(
        !textToEdit
          ? 'Не удалось добавить комментарий!'
          : 'Не удалось обновить комментарий!'
      )
    } finally {
      setValue('')
      textToEdit && setCommentToEdit({ text: '', id: '' })
    }
  }

  const cancel = () => {
    setCommentToEdit({ text: '', id: '' })
    setValue('')
  }

  useEffect(() => {
    if (textToEdit) {
      setValue(textToEdit)
      inputRef.current.focus()
    }
  }, [textToEdit])

  return (
    <>
      <div className={styles.root}>
        <Avatar classes={{ root: styles.avatar }} src="" />
        <div className={styles.form}>
          <TextField
            inputRef={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            label="Написать комментарий"
            variant="outlined"
            multiline
            maxRows={5}
            fullWidth
          />
          <Button onClick={addComment} variant="contained">
            {!textToEdit ? 'Добавить' : 'Изменить'}
          </Button>
          {textToEdit && (
            <Button onClick={cancel} variant="text" color="error" size="large">
              Отмена
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
