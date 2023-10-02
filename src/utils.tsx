import * as React from 'react'
import {
  AsyncAction,
  AsyncRun,
  AsyncState,
  StatusType,
} from './exercise/useAsync'

function useSafeDispatch<T>(dispatch: React.Dispatch<T>) {
  const mounted = React.useRef(false)

  React.useLayoutEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  return React.useCallback(
    (...args: Parameters<typeof dispatch>) =>
      mounted.current ? dispatch(...args) : void 0,
    [dispatch],
  )
}

function asyncReducer<T>(state: AsyncState<T>, action: AsyncAction<T>) {
  switch (action.type) {
    case StatusType.pending: {
      return {status: StatusType.pending, data: null, error: null}
    }
    case StatusType.resolved: {
      return {status: StatusType.resolved, data: action.data, error: null}
    }
    case StatusType.rejected: {
      return {status: StatusType.rejected, data: null, error: action.error}
    }
    default: {
      throw new Error(
        `Unhandled action type: ${(action as {type: string}).type}`,
      )
    }
  }
}

function useAsync<T>(initialState?: Partial<AsyncState<T>> | undefined) {
  const [state, unsafeDispatch] = React.useReducer<
    React.Reducer<AsyncState<T>, AsyncAction<T>>
  >(asyncReducer, {
    status: StatusType.idle,
    data: null,
    error: null,
    ...(initialState || {}),
  })

  const dispatch = useSafeDispatch(unsafeDispatch)

  const {data, error, status} = state

  const run = React.useCallback<AsyncRun<T>>(
    (promise: Promise<T>) => {
      dispatch({type: StatusType.pending})
      promise.then(
        data => {
          dispatch({type: StatusType.resolved, data})
        },
        error => {
          dispatch({type: StatusType.rejected, error})
        },
      )
    },
    [dispatch],
  )

  const setData = React.useCallback(
    (data: T) => dispatch({type: StatusType.resolved, data}),
    [dispatch],
  )
  const setError = React.useCallback(
    (error: Error) => dispatch({type: StatusType.rejected, error}),
    [dispatch],
  )

  return {
    setData,
    setError,
    error,
    status,
    data,
    run,
  }
}

export {useAsync}
