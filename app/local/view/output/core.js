import { R, B } from '../../tool';
import props from './canvas';
/**
 * @type init :: State -> IO
 */
export default function init(state){
		//load view properties to be used when rendering 
		//and other view tasks, uses Assignable convention
	var load = R.mapObjIndexed(function(loader, prop){ 
			return this[prop] = loader.bind(this)(state.context); 
		}.bind(state.view));
		//render default state		
	// 	initView = R.compose(render, initEvents, initElements);

	// return load(props) && initView(state);
	load(props);

	return render;
}

/**
 * @type render :: State -> IO
 */
function render(state){
	
	if(!state) 
		throw Error('No state to render.');

	//shortcuts
	var view	= state.view,
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


