'use strict';
import { R, Cyto, Cell } from '../../etc';
import props from './model';
import comps from './view';

var app = {
		state : {
			ui : R.map(R.prop('state'), comps)
		},
		input : new Cell(props),
		output : comps
	};

export default new Cyto(app);