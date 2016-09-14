'use strict';
import { R } from '../../etc';
import props from './model';
import comps from './view';

export default {
		state : {
			ui : R.map(R.prop('state'), comps)
		},
		input : props,
		output : comps
	};
