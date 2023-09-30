import * as React from 'react'
import {useCallback, useMemo, useReducer} from 'react'

export enum StatusType {
  idle = 'idle',
  pending = 'pending',
  resolved = 'resolved',
  rejected = 'rejected',
}

export type AsyncState<T> = {
  status: StatusType
  data?: T | null
  error?: Error | null
}
export type BaseAction = {type: string}
export type Action<T> =
  | {
      type: StatusType.pending
    }
  | {
      type: StatusType.resolved
      data: T
    }
  | {
      type: StatusType.rejected
      error: Error
    }

// 🐨 this is going to be our generic asyncReducer
export function asyncStateReducer<T>(
  state: AsyncState<T>,
  action: Action<T>,
): AsyncState<T> {
  switch (action.type) {
    case StatusType.pending: {
      return {status: StatusType.pending, data: null, error: null}
    }
    case StatusType.resolved: {
      return {
        status: StatusType.resolved,
        data: action.data,
        error: null,
      }
    }
    case 'rejected': {
      return {
        status: StatusType.rejected,
        data: null,
        error: action.error,
      }
    }
    default: {
      throw new Error(`Unhandled action type: ${(action as BaseAction).type}`)
    }
  }
}

export type AsyncRun<T> = (promise: Promise<T>) => void

export type UseAsyncReturn<T> = AsyncState<T> & {
  run: AsyncRun<T>
}
export function useAsync<T>(
  initialState: Partial<AsyncState<T>> | undefined,
): UseAsyncReturn<T> {
  const [state, dispatch] = useReducer<React.Reducer<AsyncState<T>, Action<T>>>(
    asyncStateReducer,
    {
      status: StatusType.idle,
      data: null,
      error: null,
      ...(initialState ?? {}),
    },
  )

  const run = useCallback<AsyncRun<T>>(promise => {
    console.log('Pending')
    dispatch({type: StatusType.pending})
    promise
      .then(data => {
        console.log('Resolved', data)
        dispatch({type: StatusType.resolved, data})
      })
      .catch(error => {
        console.log('Rejected', error)
        dispatch({type: StatusType.rejected, error})
      })
  }, [])

  return useMemo<UseAsyncReturn<T>>(() => ({...state, run}), [state, run])
}
