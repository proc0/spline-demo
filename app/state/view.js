'use strict';
import { R } from '../util';
import curve from './curve';
import props from './props';
import * as actions from '../event/actions';

export default { 
	init   : init, 
	render : render 
};

/**
 * @type init :: Context -> Options -> IO
 */
function init(state){
	var extract = R.compose(R.apply(R.compose), R.prepend(R.values), R.of, R.mapObjIndexed), 
		//get elements by searching the handler function name
		//as the element's class name
		//TODO: abstract this further
		getElements = extract(function(handlers, className){ 
			return document.getElementsByClassName(className); 
		}),
		loadProps = R.mapObjIndexed(function(loader, prop){ 
			return this[prop] = loader.bind(this)(state.context); 
		}.bind(state.ui.view), props);

	//attach UI elements to state
	state.ui.elements = getElements(actions);
	
	//render default state
	render(state);
	
	return state;
}
/**
 * @type render :: State -> IO
 */
function render(state){
	
	if(!state) 
		throw Error('Nothing to render.');

	//shortcuts
	var context = state.context,
		options = state.options,
		points 	= state.points,
		view	= state.ui.view,
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

	return state;
}
