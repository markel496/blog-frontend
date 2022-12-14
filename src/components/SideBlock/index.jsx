import React from 'react'
import styles from './SideBlock.module.scss'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

export const SideBlock = ({ title, children }) => {
  return (
    <Paper elevation={3} classes={{ root: styles.root }}>
      <Typography variant="h6">{title}</Typography>
      {children}
    </Paper>
  )
}
