import React from 'react'
import { Link } from 'react-router-dom'

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import TagIcon from '@mui/icons-material/Tag'
import ListItemText from '@mui/material/ListItemText'
import Skeleton from '@mui/material/Skeleton'

import { SideBlock } from './SideBlock'

export const TagsBlock = ({ items, isLoading = true }) => {
  return (
    <SideBlock title="Тэги">
      <List>
        {isLoading
          ? [...Array(5)].map((_, i) => (
              <ListItem key={i} disablePadding>
                <ListItemIcon style={{ paddingLeft: 16, marginRight: 15 }}>
                  <TagIcon />
                </ListItemIcon>
                <Skeleton width={100} height={50} />
              </ListItem>
            ))
          : items.map((name, i) => (
              <Link
                key={i}
                style={{ textDecoration: 'none', color: 'black' }}
                to={`/tags/${name}`}
              >
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <TagIcon />
                    </ListItemIcon>

                    <ListItemText primary={name} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
      </List>
    </SideBlock>
  )
}
