'use strict';
import { R } 	from './util';
import view 	from './view';
import state 	from './state';
import options	from '../options';
	/**
	 * @type init :: Seed -> IO
	 * desc init state then init view
	 */
var init = R.compose(view, state.init.bind(state)),
	/**
	 * @type initialize :: () -> IO
	 */
	initialize = function(){
		var seed = {
				context : document
					.getElementsByTagName('canvas')[0]
					.getContext('2d'),
				options : options
			};
		//initialize app
		return init(seed);
	};
//start on DOM loaded
document.addEventListener('DOMContentLoaded', initialize, false);
