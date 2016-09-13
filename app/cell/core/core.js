'use strict';
import { R } from '../../etc';
import props from './model';
import comps from './view';

export default {
		state : {
			ui : R.compose(R.chain(R.keys), R.map(R.prop('state')))(comps)
		},
		input : props,
		output : comps
	};
