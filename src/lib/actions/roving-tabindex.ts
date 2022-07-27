import type { Action } from './types';

export default (node: HTMLElement, selector: string): ReturnType<Action> => {
  // set up roving tabindex
  const elements = Array.from(node.querySelectorAll(selector));
  elements.forEach(element => {
    element.setAttribute('tabindex', '-1');
  })
};
