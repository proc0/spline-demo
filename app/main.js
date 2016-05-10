'use strict';
import model 	from './model';
import state 	from './state';
import options 	from '../options';

var canvas  = document.getElementsByTagName('canvas')[0],
	sliders = document.getElementsByClassName('slider'),
	context = canvas.getContext('2d');

//load options
//set default text from the template
options.helpText = canvas.innerHTML;

//assign closures
model.context = context;
model.options = options;
model.sliders = sliders;

function start(){
	//initialize state
	state.init(model);
}

document.addEventListener('DOMContentLoaded', start, false);
