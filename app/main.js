import data 	from './data';
import view 	from './view';
import events 	from './events';
import options 	from '../options';

var canvas = document.getElementsByTagName('canvas')[0],
	sliders = document.getElementsByClassName('slider'),
	context = canvas.getContext('2d');

//load options
//set default text from the template
options.helpText = canvas.innerHTML;

//assign closures
data.context = context;
data.options = options;

function start(){
	//initialize events
	events.init(sliders);
	//first render
	view.init(context, options);
}

document.addEventListener('DOMContentLoaded', start, false);
