import { cyto } from '../meta';
import output from './output/core';
import intput from './intput/core';

var seed = {
		state : {
			dom : document
		},
		input : intput,
		output : output
	};
/**
 * @name Output
 * @type output :: WorldData -> IO
 */
export default cyto(seed);