import { R, B } from '../../tool';
import cells from './cells';
/**
 * @type init :: State -> IO
 */
export default function init(seed){

	var state = seed.init,
		view = state.view = {};

	view.options = state.options;
	view.context = state.dom
		.getElementsByClassName('canvas')[0]
		.getContext('2d');

	//load view properties to be used when rendering 
	//and other view tasks, uses Assignable convention
	var load = R.mapObjIndexed(function(loader, prop){ 
			return view[prop] = loader(view); 
		});

	return load(cells) && render;
}

/**
 * @type render :: State -> IO
 */
function render(state){
	
	if(!state) 
		throw Error('No state to render.');

	//shortcuts
	var view 	= state.view,
		points 	= view.points,
		context = view.context,
		options = view.options,
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


