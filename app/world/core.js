import { R, cyto } from '../tool';
import view from './view/core';
import state from './state/core';
/**
 * @name AppCore
 * @type init :: WorldData -> IO
 * @cyto app :: IO -> IO
 */

// export default function world(io){
// 	if(io.init){
// 		return document.addEventListener('DOMContentLoaded', io.init, false);
// 	} else {
// 		//io.input = DOM init Event
// 		//meta state
// 		var meta = {
// 	 			state : {
// 		 			options : io.state,
// 		 			dom : document,
// 		 			view : {}
// 	 			},
// 	 			input  : {},
// 	 			output : {}
// 	 		};

// 	 // 	return {
// 	 // 		data : meta,
// 		// 	input : state(meta),
// 		// 	output : view(meta)
// 		// };

// 		return R.compose(view, state)(meta);
// 	}
// };
var seed = {
		dom : document,
		view : {}
	};
export default cyto(state(seed), view(seed), seed);