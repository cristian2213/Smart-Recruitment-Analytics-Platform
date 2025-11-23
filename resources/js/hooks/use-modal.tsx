import { useReducer } from 'react'

// Make the modal keys generic so callers can provide their own union type
type ModalState<T extends string> = Record<T, boolean>

type Action<T extends string> =
  | { type: 'OPEN_MODAL'; modal: T }
  | { type: 'CLOSE_MODAL'; modal: T }
  | { type: 'TOGGLE_MODAL'; modal: T }
  | { type: 'CLOSE_ALL' }

interface UseModalProps<T extends string> {
  initialState: ModalState<T>
}

export function useModal<T extends string>({ initialState }: UseModalProps<T>) {
  const reducer = (state: ModalState<T>, action: Action<T>): ModalState<T> => {
    switch (action.type) {
      case 'OPEN_MODAL':
        return { ...state, [action.modal]: true }
      case 'CLOSE_MODAL':
        return { ...state, [action.modal]: false }
      case 'TOGGLE_MODAL':
        return { ...state, [action.modal]: !state[action.modal] }
      case 'CLOSE_ALL':
        return Object.keys(state).reduce((acc, key) => {
          acc[key as T] = false
          return acc
        }, {} as ModalState<T>)
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  return {
    state,
    dispatch,
  }
}
