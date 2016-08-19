import { R, cyto } from '../meta';
// import view from './view/core';
// import state from './state/core';

/**
 * @name AppCore
 * @type init :: WorldData -> IO
 * @cyto app :: IO -> IO
 */

// export default function local(world){
// 	if(world.init)
// 		return R.map(R.flip(R.apply)(world.init), R.pluck('init', [view, state]));
	
// 	var seed = {
// 		state : {
// 	 		world : world,
// 			view : {
// 				elements : []
// 			},
// 			points : []
// 		},
// 		input : state(world),
// 		output : view(world)
// 	};

// 	return R.compose(view, state)(seed);
// }

var seed = 	{
		view : {
			elements : []
		},
		points : []
	},
	view = function(){
		console.log('local view');

		return function(state){

		}
	},
	model = function(){
		console.log('local model');

		return function(state){

		}
	};

export default cyto({ output: view, input : model, state : seed });