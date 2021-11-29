//@ts-check
import { configureStore } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import postsReducer from '../features/posts/postSlice'
import usersReducer from '../features/users/usersSlice'
import notificationsReducer from '../features/notifications/notificationsSlice'
const store = configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    notifications: notificationsReducer,
  },
})
export default store

/**
 * @typedef {ReturnType<typeof store.getState>} RootState
 * @typedef {typeof store.dispatch} AppDispatch
 */
export const useAppDispatch = () => useDispatch()

/**
 * @type {import('react-redux').TypedUseSelectorHook<RootState>}
 */
export const useAppSelector = useSelector
