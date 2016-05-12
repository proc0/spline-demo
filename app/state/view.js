'use strict';
import { R } from '../util';
import curve from './curve';
import props from './props';

export default { 
	init   : init, 
	render : render 
};

var view = { curve : [] };
/**
 * @type init :: Context -> Options -> IO
 */
function init(model){
	//load prop functions for rendering
	R.mapObjIndexed(function(loader, prop){
		this[prop] = loader.bind(this)(model.context);
	}.bind(view), props);
	//render default text
	return render(model);
}
/**
 * @type render :: Model -> IO
 */
function render(model){
	
	var context = model.context,
		options = model.options,
		points 	= model.points,
		width	= context.canvas.width,
		height	= context.canvas.height,
		draw 	= view.draw.bind(view)(options);

	context.clearRect(0, 0, width, height);

	//no points to render
	if(!points || points.length < 1){
		//render default text
		return draw('bgtext')(options.helpText);
	}

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
