'use strict';
import { R, B } from '../../tool';
import input from './state/core';
import output from './view/core';
import * as events from './input/ui';

var combine = R.compose(R.map(R.apply(R.call)), R.zip),
	extract = R.compose(R.apply(R.compose), R.prepend(R.values), R.of, R.mapObjIndexed);

//should only be called once
export default function init(stateMonad){
	
	var state = stateMonad(),
		view = state.view,
		world = state.world,
		/**
		 * EventBind Pipeline
		 */
		//set stuff on view
		setInput 	= R.set(R.lensProp('input'), input(state)),
		setOutput 	= R.set(R.lensProp('output'), output(state)),
		setElements = R.flip(R.set(R.lensProp('elements')))(view),
		processView = R.compose(setOutput, setInput, setElements),
		//use event handler object to get dom elements form world
		processEvents = R.compose(processView, world.output),
		//initiate view bindings and evnets, and return elements for
		//even more event binding.
		initView = R.compose(R.prop('elements'), processEvents),
		//bind all action creators to events
		initialize = R.converge(combine, [extract(bindEvents), initView]);

	return initialize(events);
}

//bind an array of elements to Bacon events
function bindEvents(stateMonad){
	var _bind = R.curry(function(handlers, elements){
		//use bindEvent to bind to HTMLElement, bind to state Controller (not runtime)
		return R.map(R.curry(bindEvent)(handlers).bind(stateMonad), elements);
	});
	//bind each ui element to the reducer function
	return R.compose(_bind, R.identity);
}

//bind an element to a Bacon Events
function bindEvent(handlers, element){
		//get state
	var state = this(),
		State = state.meta,
		view = state.view,
		noop = Function.prototype,
		//process ui input
		I = R.flip(R.apply)(view.input),
		//only render if output is State
		O = R.ifElse(State, view.output, noop),
	/** IO :: IO -> IO ;-- StateMonad <- Input
	 * ---------------------------------------------- */
		IO = R.compose(O, I, this), 
		//IO = R.pipe(this, I, O) works?
		baconWrap = function(handler, event){
			//only bind if handler is a function
			if('function' === typeof handler)
				//Bacon stream event from HTMLElement
				B.fromEvent(element, event).onValue(IO);
		};
	//map element handlers by using the object
	//property name as the event name
	return R.mapObjIndexed(baconWrap, handlers);
}

