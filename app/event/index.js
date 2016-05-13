'use strict';
import { R, B } from '../util';
import view 	from '../state/view';
import model 	from '../data/model';
import * as actions from './actions';

export default function init(state){
	var combine = R.compose(R.map(R.apply(R.call)), R.zip),
		extract = R.compose(R.apply(R.compose), R.prepend(R.values), R.of, R.mapObjIndexed), 
		//bind an array of elements to Bacon events
		bindElements = R.curry(function(events, elements){
			//use bindElement to bind to HTMLElement
			return R.map(R.curry(bindElement)(events), elements);
		}),
		bindEvents = extract(R.compose(bindElements, R.identity)),
		bindActions = R.converge(combine, [bindEvents, R.always(state.ui.elements)]);

	bindActions(actions);

	//initialize UI controllers
	actions.slider.init(state);

	return state;
}

//bind an element to a Bacon Events
function bindElement(events, element){
	//closure arguments to map on events
	var mapEvent = function(handler, eventName){
			var metaHandler = function(event){
					var state	= model.getState(),
						State	= model.getInstance(),
						reduce	= model.state.bind(state),
						translate = handler.bind(events),
						//render if model returns state
						render = function(viewState){
							if(viewState && viewState instanceof State)
								return view.render.bind(view)(viewState);
							else
								return false;
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
