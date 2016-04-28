import view from './view';
import menu from './menu';
import events from './events';
import options from './options';

var $canvas 	= document.getElementsByTagName('canvas'),
	$sliders 	= document.getElementsByClassName('slider'),
	$checkboxes = document.getElementsByClassName('checkbox'),
	context = $canvas[0].getContext('2d');

//initialize UI controllers
menu.updateLabels($sliders);
//TODO: needs to be called twice to avoid offset?
menu.updateLabels($sliders);
//initialize var closures
events.init(context, options);

view.render(context, options);


