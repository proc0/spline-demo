'use strict';
import { R } 	from './util';
import view 	from './state/view';
import model 	from './model';
import state 	from './state';
import options	from '../options';

var canvas  = document.getElementsByTagName('canvas')[0],
	sliders = document.getElementsByClassName('slider'),
	context = canvas.getContext('2d');

//load options
//set default text from the template
options.helpText = canvas.innerHTML;

function start(){
	var init = R.compose(R.apply(R.compose), R.map(R.prop('init')));

	return init([view, state, model])(context, options);
}

document.addEventListener('DOMContentLoaded', start, false);
