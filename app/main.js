'use strict';
import { R } 	from './util';
import view 	from './view';
import model 	from './model';
import control 	from './control';
import options	from '../options';
	/**
	 * @type initialize :: [Component] -> (State -> IO)
	 */
var initialize = R.compose(R.apply(R.compose), R.map(R.prop('init'))),
	/**
	 * @type start :: () -> IO
	 */
	start = function(){
		var state = {
				context : document.getElementsByTagName('canvas')[0].getContext('2d'),
				options : options
			},
			//initialize with initial state starting with model
			//then view loads its props, then events bind actions
			init = initialize([{ init : control }, view, model]);
		//initialize app
		return init(state);
	};
//start on DOM loaded
document.addEventListener('DOMContentLoaded', start, false);
