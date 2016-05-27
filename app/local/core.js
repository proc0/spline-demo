import { R, B } from '../tool';
import view from './view/core';
import state from './state/core';

/**
 * @name AppCore
 * @type init :: WorldData -> IO
 * @cyto app :: IO -> IO
 */

export default function init(world){
	return R.compose(view, state, seed)(world);
}

function seed(world){
 	return {
 		world : world,
		view : {
			elements : []
		},
		points : []
	};
};