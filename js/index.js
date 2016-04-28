import view from './view';
import menu from './menu';
import events from './events';
import options from './options';
import closures from './closures';

var context = document.getElementsByTagName('canvas')[0].getContext('2d');

closures.context = context;
closures.options = options;

//initialize events
//with closures
events.init();
//first render
view.render(context, options);


