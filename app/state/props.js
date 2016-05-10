import { 
	R, 
	getPoint, 
	getPoints 
} from '../util';
/**
 *	@member props {Object}
 *	@desc	contains key/value where value is a high order function
 *	@type 	prop :: Context -> (* -> IO)
 */
export default {
	/**
	 * @type paint :: Context -> (String -> View -> Options -> Data -> IO)
	 */
	paint : function(context){

		return R.curry(function(drawer, view, options, data){
			view.config( options );
			
			if(typeof data !== 'string')
				view.canvas('beginPath')();

			view.comp[drawer](data, view);
			
			if(typeof data !== 'string')
				view.canvas('stroke')();		
		});
	},		
	/**
	 *	@type config :: Context -> (Object -> IO)
	 *	@desc returns a function that will set a property on
	 *        the canvas context object. Needs to be imperative.
	 */
	config : function(context){
			//setting context cannot be functional style?
		var setContext = function(val, key, obj){
				return R.prop(key, context) ? (context[key] = val) : null;
			};
		return R.mapObjIndexed(setContext);
	},
	/**
	 * @type canvas :: Context -> (String -> (* -> IO))
	 * @desc returns a function that will return a canvas API method
	 * 		 ready to be invoked with whatever params it needs
	 */
	canvas : function(context){
		return R.compose(R.flip(R.bind)(context), R.flip(R.prop)(context));
	},
	/**
	 *	@type draw :: Context -> String 
	 */		
	draw : function(context){
			//extract style options
		var getOptions = R.compose(R.flip(R.prop), R.prop('style')),
			buildParams = R.compose(R.prepend(R.identity), R.prepend(R.always(this)));

		return R.compose(R.converge(this.paint), buildParams, R.of, getOptions);
	},

	/**
	 * @type comp :: Context -> Assigneable
	 */
	comp : function(context){
		return {
			/**
			 *
			 */				
			curve 	: function(points, view){
				var lineTo = R.apply(view.canvas('lineTo'));
				
				return R.compose(R.map(lineTo), getPoints)(points);
			},
			/**
			 *
			 */
			verts 	: function(points, view){
				var w = 6, h = 6,
					offset = R.flip(R.subtract)(w/2),
					dimens = R.flip(R.concat)([w, h]),
					params = R.compose(dimens, getPoint, R.map(offset)),
					rect = R.apply(view.canvas('rect'));

				return R.compose(R.map(rect), R.map(params))(points);
			},
			/**
			 *
			 */				
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
};