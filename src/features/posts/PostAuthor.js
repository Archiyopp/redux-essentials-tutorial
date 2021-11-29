import React from 'react'
import { useAppSelector } from '../../app/store'
import { selectUserById } from '../users/usersSlice'

export const PostAuthor = ({ userId }) => {
  const author = useAppSelector(selectUserById)

  return <span>by {author ? author.name : 'Unknown author'}</span>
}
