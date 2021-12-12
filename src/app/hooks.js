import { useDispatch, useSelector } from 'react-redux'

/**@type {() => import('react').Dispatch<import('./store').RootDispatch} */
export const useAppDispatch = () => useDispatch()

/**
 * @type {import('react-redux').TypedUseSelectorHook<RootState>}
 */
export const useAppSelector = useSelector
