'use strict';
import { R } 	from './util';
import view 	from './state/view';
import model 	from './data/model';
import events 	from './event';
import options	from '../options';
	/**
	 * @type initialize :: [Component] -> (State -> IO)
	 */
var initialize = R.compose(R.apply(R.compose), R.map(R.prop('init'))),
	/**
	 * @type start :: () -> IO
	 */
	start = function(){
		//attach canvas context
		//and options to state
		var state = {
				context : document.getElementsByTagName('canvas')[0].getContext('2d'),
				options : options
			},
			//initialize with initial state starting with model
			//then view loads its props, then events bind actions
			init = initialize([{ init : events }, view, model]);
		//initialize app
		return init(state);
	};
//start on DOM loaded
document.addEventListener('DOMContentLoaded', start, false);
