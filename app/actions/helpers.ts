import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

export interface IAction extends Action { }
export interface IActionWithPayload<T> extends IAction {
  readonly payload: T;
}

interface IActionCreator<T> {
  readonly type: string;
  (payload: T): IActionWithPayload<T>;

  test(action: IAction): action is IActionWithPayload<T>;
}

interface IActionCreatorVoid {
  readonly type: string;
  (): IAction;

  test(action: IAction): action is IAction;
}

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

export type IThunkAction = ThunkAction<void, any, void>;
export type IDispatch = <A extends IAction | IThunkAction>(action: A) => A;
export type IThunkActionCreator = (...args: any[]) => IThunkAction;

export const thunkActionCreator = <T>(api: (payload: T, dispatch: IDispatch, getState: () => any) => void): IThunkActionCreator =>
  Object.assign(<V extends T>(payload: V): IThunkAction => (dispatch: IDispatch, getState: () => any): void => api(payload, dispatch, getState));
