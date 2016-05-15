'use strict';
import { R, B } from '../util';
import curve from '../util/curve';
import props from './props';
import * as events from './events';

/**
 * @type init :: State -> IO
 */
export default function init(state){
		//load view properties to be used when rendering 
		//and other view tasks, uses Assignable convention
	var load = R.mapObjIndexed(function(loader, prop){ 
			return this[prop] = loader.bind(this)(state.context); 
		}.bind(state.ui.view)),
		//render default state		
		initView = R.compose(render, initEvents, initElements);

	return load(props) && initView(state);
}

/**
 * @type render :: State -> IO
 */
function render(state){
	
	if(!state) 
		throw Error('No state to render.');

	//shortcuts
	var view	= state.ui.view,
		points 	= state.points,
		context = state.context,
		options = state.options,
		width	= context.canvas.width,
		height	= context.canvas.height,
		draw 	= view.draw.bind(view)(options);

	//clear canvas
	context.clearRect(0, 0, width, height);
	//no points to render
	if(!points || points.length < 1)
		//render default text (from HTML)
		return draw('bgtext')(context.canvas.innerHTML);

	//render points into curve
	if(points && points.length >= 2){
		//save curve points for select drag render
		view.curve = curve(points, options['curve']);
		//render curve
		draw('curve')(view.curve);
		//fill curve
		if(options.curve.fill)
			view.canvas('fill')();
	}
	
	//draw vertex points if > 1 point
	if(options.curve.showPoints) 
		draw('verts')(points);
}

//attach UI elements to state
function initElements(state){
	var extract = R.compose(R.apply(R.compose), R.prepend(R.values), R.of, R.mapObjIndexed), 
		getElements = extract(function(handlers, className){ 
			return document.getElementsByClassName(className); 
		});

	state.ui.elements = getElements(events);

	return state;
}

//initialize events
function initEvents(state){
	var combine = R.compose(R.map(R.apply(R.call)), R.zip),
		extract = R.compose(R.apply(R.compose), R.prepend(R.values), R.of, R.mapObjIndexed), 
		//bind an array of elements to Bacon events
		bindElements = R.curry(function(handlers, elements){
			//use bindElement to bind to HTMLElement, bind to state Controller (not runtime)
			return R.map(R.curry(bindElement)(handlers).bind(state.data.meta), elements);
		}),
		bindEvents = extract(R.compose(bindElements, R.identity)),
		//bind all action creators to events
		initialize = R.converge(combine, [bindEvents, R.always(state.ui.elements)]);

	initialize(events);

	//initialize UI controllers
	//TODO: propagate and properly abstract
	//init function to all event handlers
	events.slider.init(state);

	return state;
}

//bind an element to a Bacon Events
function bindElement(handlers, element){
	//bound to state
	var state = this,
		_bind = function(handler, eventName){
			//meta handler uses handler closure
			var trigger = function(event){
					var prev 	= state.get(),
						State 	= state.State,
						next 	= state.set.bind(state),
						handle 	= handler.bind(handlers),
						noop 	= function(){ return; },
						isState = function(s){ return s instanceof State },
						//only render if model returns State
						IO  	= R.ifElse(isState, render, noop),
						process = R.compose(IO, next, handle);
					//process = handle next IO 
					//w/ current event and prev state
					return process(event, prev);
				};
			//only bind if handler is a function
			if('function' === typeof handler)
				//Bacon stream event from HTMLElement
				B.fromEvent(element, eventName).onValue(trigger);
		};
	//map element handlers by using the object
	//property name as the event name
	return R.mapObjIndexed(_bind, handlers);
}
