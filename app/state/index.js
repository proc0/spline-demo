'use strict';
import { R, B } from '../util';
import view 	from './view';
import model 	from '../model';
import * as actions from '../actions';

export default { init : init };

//save context state and options
function init(model){
	//initialize UI controllers
	actions.slider.updateLabels(document.getElementsByClassName('slider'));
	//bind all elements and their events to all actions
	R.mapObjIndexed(bindElements, actions);

	return model;
}

//bind an element to a Bacon Events
function bindElement(events, element){
	//closure arguments to map on events
	var mapEvent = function(handler, eventName){
			var metaHandler = function(event){
					var state	= model.getState(),
						Model	= model.getInstance(),
						reduce	= model.state.bind(state),
						translate = handler.bind(events),
						//render if model returns state
						render = function(viewModel){
							if(viewModel && viewModel instanceof Model)
								return view.render.bind(view)(viewModel);
						};

					return R.compose(render, reduce, translate)(event, state);
				};
			//only bind if handler is a function
			if('function' === typeof handler)
				//Bacon stream event from HTMLElement
				B.fromEvent(element, eventName)
					.onValue(metaHandler);
		};
	//map element events by using the object
	//property name as the event name
	return R.mapObjIndexed(mapEvent, events);
}

//bind an array of elements to Bacon events
function bindElements(events, className){
	var elements = document.getElementsByClassName(className);
	//use bindElement to bind to HTMLElement
	return R.map(R.curry(bindElement)(events), elements);
}


