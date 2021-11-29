import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit'
import { client } from '../../api/client'
/**
 * @typedef {{id: string, name: string }} User
 * @typedef {import('../../app/store').RootState} RootState
 */

/**@type {import('@reduxjs/toolkit').EntityAdapter<User>} */
const usersAdapter = createEntityAdapter()

const initialState = usersAdapter.getInitialState()
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get('/fakeApi/users')
  return response.data
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll)
  },
})

export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors((/**@type {RootState} */ state) => state.users)

export default usersSlice.reducer
