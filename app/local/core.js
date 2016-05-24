import { R, B } from '../tool';
import view from './view/core';
import state from './state/core';
// import State from '../state/data/types/state';
// import * as events from './input/ui';
/**
 * @type local :: World -> IO
 * @cyto app :: IO -> IO
 */
 export default R.compose(view, state);
// export default {
// 	core : R.compose(view.output, state.model, view.input, state.data),
// 	state : state,
// 	view : view
// }
// R.compose( R.flip(state)(view.input));
