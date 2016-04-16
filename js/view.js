define([
	'../node_modules/ramda/dist/ramda', 
	'../node_modules/baconjs/dist/Bacon', 
	'./curve',
	'./point',
	'./menu'
	], function(
		R,
		B,
		curve,
		point,
		menu
	){
	'use strict';

	return {
		init : function(context){
			
			var setContext = function(val, key, obj){
					return R.prop(key, context) ? context[key] = val : null;
				};

			this.canvas = R.compose(R.flip(R.bind)(context), R.flip(R.prop)(context));
			this.configure = R.mapObjIndexed(setContext);		
			
			this.draw = {
				curve : this.drawCurve.bind(this),
				verts : this.drawVerts.bind(this)
			};
			
			context.loaded = true;
		},
		render : function(context, points, options){

			if(!context.loaded) 
				this.init(context);

			var self = this,
				w = context.canvas.width,
				h = context.canvas.height,
				getOpts = R.flip(R.prop)(options.style),
				draw = R.converge(this.paint, [R.identity, getOpts, R.always(self)]);

			context.clearRect(0, 0, w, h);

			if(points.length > 1){
				// options.curve.segments = points.length * 2;
				this.curve = curve( points, options['curve'] );
				draw('curve')(this.curve);
			}
			
			draw('verts')(points);
		},

		paint : R.curry(function(drawer, options, view, points){
			view.configure( options );
			view.canvas('beginPath')();
			view.draw[drawer]( points );
			view.canvas('stroke')();
		}),

		drawCurve : function(points){
			var lineTo = R.apply(this.canvas('lineTo')),
				draw = R.compose(R.map(lineTo), R.map(point.getPoint));
			
			return draw(points);
		},

		drawVerts : function(points){
			var w = 6, h = 6,
				offset = R.flip(R.subtract)(w/2),
				dimens = R.flip(R.concat)([w, h]),
				params = R.compose(dimens, point.getPoint, R.map(offset)),
				rect = R.apply(this.canvas('rect')),
				draw = R.compose(R.map(rect), R.map(params));

			return draw(points);
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
});