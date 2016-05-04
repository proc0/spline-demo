'use strict';
import { R, B, getPoint } from './util';
import curve from './curve';

var view = {
	//local closure
	curve : [],
	
	init : function(context, options){
		//load prop functions for rendering
		R.mapObjIndexed(function(loader, prop){
			this[prop] = loader.bind(this)(context);
		}.bind(this), this.props);
		//render default text
		return this.render(context, options);
	},

	render : function(context, options, points){

		var w = context.canvas.width,
			h = context.canvas.height,
			draw = this.draw(options);

		context.clearRect(0, 0, w, h);
		//render points into curve
		if(points && points.length >= 2){
			//save curve points for select drag render
			this.curve = curve(points, options['curve']);
			//render curve
			draw('curve')(this.curve);
			//fill curve
			if(options.curve.fill) 
				this.canvas('fill')();
		//no points to render
		} else {
			//render default text
			return draw('bgtext')(options.helpText);
		}
		//draw vertex points
		if(options.curve.showPoints) 
			draw('verts')(points);
	},

	paint : R.curry(function(drawer, view, options, data){
		view.config( options );
		
		if(typeof data !== 'string')
			view.canvas('beginPath')();

		view.comp[drawer](data, view);
		
		if(typeof data !== 'string')
			view.canvas('stroke')();		
		
	}),

	props : {

		config : function(context){
				//setting context properties has to change context state
				//so wrapping it in a function
			var setContext = function(val, key, obj){
					return R.prop(key, context) ? (context[key] = val) : null;
				};
			return R.mapObjIndexed(setContext);
		},

		canvas : function(context){
			return R.compose(R.flip(R.bind)(context), R.flip(R.prop)(context));
		},

		draw : function(){
				//extract style options
			var getOptions = R.compose(R.flip(R.prop), R.prop('style')),
				buildParams = R.compose(R.prepend(R.identity), R.prepend(R.always(this)));

			return R.compose(R.converge(this.paint), buildParams, R.of, getOptions);
		},

		comp : function(context){
			return {
				curve 	: function(points, view){
					var lineTo = R.apply(view.canvas('lineTo'));
					
					return R.compose(R.map(lineTo), R.map(getPoint))(points);
				},
				verts 	: function(points, view){
					var w = 6, h = 6,
						offset = R.flip(R.subtract)(w/2),
						dimens = R.flip(R.concat)([w, h]),
						params = R.compose(dimens, getPoint, R.map(offset)),
						rect = R.apply(view.canvas('rect'));

					return R.compose(R.map(rect), R.map(params))(points);
				},
				bgtext 	: function(text, view){
					var w = context.canvas.width,
						h = context.canvas.height,
						//center text
						x = w/2 - (text.length*10)/2,
						y = h/2;

					return view.canvas('fillText')(text, x, y);
				}
			};
		}
	}
};

export default { init : view.init.bind(view) };
export var render = view.render.bind(view);