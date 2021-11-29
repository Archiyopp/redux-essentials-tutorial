//@ts-check
import {
  createAsyncThunk,
  createSlice,
  createSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit'
import { client } from '../../api/client'

/**
 * @template T
 * @typedef {import('@reduxjs/toolkit').PayloadAction<T>} PayloadAction
 */

/**
 * @typedef {import('../../app/store').RootState} RootState
 * @typedef {{id: string, title: string, content: string, date: string, reactions: any, user: string}} Post
 * @typedef {{reaction: string, postId: string|number}} AddReaction
 */

/**
 * @type {import('@reduxjs/toolkit').EntityAdapter<Post>}
 */
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})

const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null,
})

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (initialPost) => {
    const response = await client.post('/fakeApi/posts', initialPost)
    return response.data
  }
)

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    /**
     * @param {PayloadAction<Post>} action
     */
    postUpdated: (state, action) => {
      const { id, title, content } = action.payload
      const existingPost = state.entities[id]
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
    /**
     * @param {PayloadAction<AddReaction>} action
     */
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.entities[postId]
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(
        fetchPosts.fulfilled,
        (state, /**@type {PayloadAction<Post[]>} */ action) => {
          state.status = 'succeeded'
          // Add any fetched posts to the array
          postsAdapter.upsertMany(state, action.payload)
        }
      )
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addNewPost.fulfilled, postsAdapter.addOne)
  },
})

export const { postUpdated, reactionAdded } = postsSlice.actions

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((/**@type {RootState} */ state) => state.posts)

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.user === userId)
)

export default postsSlice.reducer
