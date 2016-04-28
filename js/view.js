'use strict';
import R from '../node_modules/ramda/dist/ramda';
import B from '../node_modules/baconjs/dist/Bacon';
import curve from './curve';
import point from './point';
import menu from './menu';

export default {
	//local closure
	curve : [],

	init : function(context, options){
			//setting context properties has to change context state
			//so wrapping it in a function
		var setContext = function(val, key, obj){
				return R.prop(key, context) ? context[key] = val : null;
			},
			//extract style options
			getOpts = R.compose(R.flip(R.prop), R.prop('style'));

		this.context = context;
		//load render functions with context
		this.configure = R.mapObjIndexed(setContext);
		this.canvas = R.compose(R.flip(R.bind)(context), R.flip(R.prop)(context));
		this.draw = R.compose(R.converge(this.paint), R.prepend(R.identity), R.prepend(R.always(this)), R.of, getOpts);
		this.drawComp = {
			curve : this.drawCurve.bind(this),
			verts : this.drawVerts.bind(this)
		};

		return context.loaded = true;
	},
	//calculate mouse X Y
	getMouse : function(context, event){
		var client = context.canvas.getBoundingClientRect(),
			x = event.x - client.left,
			y = event.y - client.top;
		return new point(x, y);
	},

	render : function(context, options, points){

		//init context and 
		//dependent functions
		if(!context.loaded) 
			this.init(context, options);

		var w = context.canvas.width,
			h = context.canvas.height;

		context.clearRect(0, 0, w, h);

		//render points
		if(points && points.length >= 2){
			//save curve points for select drag render
			this.curve = curve( points, options['curve'] );
			//render curve
			this.draw(options)('curve')(this.curve);
			//fill curve
			if(options.curve.fill)
				this.canvas('fill')();

		} else if(!points || points.length < 1){ //no points to render
			var font = { 'font' : '24px sans-serif' },
				helpText = document.getElementsByTagName('canvas')[0].innerHTML;
			//render default text
			return this.defaultText(this, font, helpText);
		}

		//draw vertex points
		if(options.curve.showPoints) 
			this.draw(options)('verts')(points);
	},

	paint : R.curry(function(drawer, view, options, points){
		view.configure( options );
		view.canvas('beginPath')();
		view.drawComp[drawer]( points );
		view.canvas('stroke')();
	}),

	defaultText : function(view, options, text){
		var w = view.context.canvas.width,
			h = view.context.canvas.height,
			//center text
			x = w/2 - (text.length*10)/2,
			y = h/2;

		view.configure( options );

		return view.canvas('fillText')(text, x, y);
	},

	drawCurve : function(points){
		var lineTo = R.apply(this.canvas('lineTo')),
			_draw = R.compose(R.map(lineTo), R.map(point.getPoint));
		
		return _draw(points);
	},

	drawVerts : function(points){
		var w = 6, h = 6,
			offset = R.flip(R.subtract)(w/2),
			dimens = R.flip(R.concat)([w, h]),
			params = R.compose(dimens, point.getPoint, R.map(offset)),
			rect = R.apply(this.canvas('rect')),
			_draw = R.compose(R.map(rect), R.map(params));

		return _draw(points);
	},
	//partitions an array into chunks
	chunk : R.curry(function(amount, list){
		//recursive function
		var split = function(list){
				var step = R.compose(split, R.splitAt(amount), R.last),
					recurse = R.converge(R.concat, [R.compose(R.of, R.head), step]),
					hasLength = R.compose(R.flip(R.gt)(amount), R.length, R.last);

				return R.ifElse(hasLength, recurse, R.identity)(list);
			},
			init = R.compose(split, R.splitAt(amount));
		// check input and start recursion
		return (list && list.length > amount) ? init(list) : (list.length === amount) ? [list] : list;
	}),

	findPoint : R.curry(function(mouse, points){
		var x = mouse.x,
			y = mouse.y,
			area = 10,
			
			sub_area = R.compose(R.flip(R.gt), R.flip(R.subtract)(area)),
			add_area = R.compose(R.flip(R.lt), R.flip(R.add)(area)),
			area_point = R.converge(Array, [sub_area, add_area]),
			area_curve = R.compose(R.map(R.map(area_point))),
			
			check_point = R.compose(R.map, R.flip(R.apply), R.of),
			check_x 	= R.compose(check_point(x), R.prop('x')),
			check_y 	= R.compose(check_point(y), R.prop('y')),
			check_curve = R.converge(R.concat, [check_x, check_y]),
			
			search_area = R.compose(R.map(check_curve), area_curve),
			
			atLeast = R.compose(R.apply(R.compose), R.append(R.filter(R.identity)), R.append(R.length), R.of, R.equals), 
			extract = R.compose(R.findIndex(R.identity), R.map(atLeast(4)));

		return extract(search_area( points ));
	})	
};