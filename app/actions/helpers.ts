import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

export interface IAction extends Action { }
export interface IActionWithPayload<T> extends IAction {
  readonly payload: T;
}

export interface IActionCreator<T> {
  readonly type: string;
  (payload: T): IActionWithPayload<T>;
  test(action: IAction): action is IActionWithPayload<T>;
}

export interface IActionCreatorVoid {
  readonly type: string;
  (): IAction;
  test(action: IAction): action is IAction;
}

export type IThunkAction = ThunkAction<void, IAction, void>;
export type IDispatch = (action: IAction | IThunkAction, getState?: () => void) => void;

export const actionCreator = <T>(type: string): IActionCreator<T> =>
  Object.assign((payload: T): any => ({ type, payload }), {
    type,
    test(action: IAction): action is IActionWithPayload<T> {
      return action.type === type;
    }
  });

export const actionCreatorVoid = (type: string): IActionCreatorVoid =>
  Object.assign((): any => ({ type }), {
    type,
    test(action: IAction): action is IAction {
      return action.type === type;
    }
  });

type ThunkActionCreator = <T>(payload: T) => IThunkAction;

export const thunkActionCreator = <T>(api: (payload: T, dispatch: IDispatch) => void): ThunkActionCreator =>
  Object.assign(<V extends T>(payload: V): IThunkAction => (dispatch: IDispatch): void => api(payload, dispatch));
