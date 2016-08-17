import { cyto } from '../meta';
import view from './view/core';
import model from './model/core';

var seed = {
		state : {
			dom : document,
			ui : {}
		},
		input : model,
		output : view
	};
/**
 * @name Output
 * @type output :: WorldData -> IO
 */
export default cyto(seed);