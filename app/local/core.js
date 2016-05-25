import { R, B } from '../tool';
import view from './view/core';
import state from './state/core';
// import State from '../state/data/types/state';
// import * as events from './input/ui';
/**
 * @type local :: World -> IO
 * @cyto app :: IO -> IO
 */
 //world : { options, state }
 export var local = R.converge(R.call, [view, state]);
// export default {
// 	core : R.compose(view.output, state.model, view.input, state.data),
// 	state : state,
// 	view : view
// }
// R.compose( R.flip(state)(view.input));
