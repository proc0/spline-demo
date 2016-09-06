'use strict';
import { cyto } from '../../etc';
import props from 'model';
import comps from 'view';

var core = {
		state : {},
		input : props,
		output : comps
	};

export default cyto(core);

