import { R, B } from '../tool';
// import view from './view/core';
// import state from './state/core';

/**
 * @type world :: DOM -> IO
 */
// var world = R.compose(view, state);

export default function(options){ return R.merge({ state : document }, options) };