'use strict';
import { R, Cyto, State } from '../../etc';
import model from './model/core';
import view from './view';

export default new Cyto({
	state : {
        name: 'app'
	},
	input : model,
	output : view
})
