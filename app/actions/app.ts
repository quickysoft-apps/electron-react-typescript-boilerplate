import { actionCreatorVoid, actionCreator } from './helpers';

export const hide = actionCreatorVoid('app/HIDE');
export const show = actionCreatorVoid('app/SHOW');
export const toggleMenu = actionCreator<boolean>('app/menu');
