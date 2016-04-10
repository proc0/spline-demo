define([
	'../node_modules/ramda/dist/ramda', 
	'../node_modules/baconjs/dist/Bacon', 
	'./curve'
	], function(
		R,
		B,
		curve
	){
	'use strict';

	return {
		init : function(context){
			
			var setContext = function(val, key, obj){
					return R.prop(key, context) ? context[key] = val : null;
				};

			this.configure = R.mapObjIndexed(setContext);
			this.canvas = R.compose(R.flip(R.bind)(context), R.flip(R.prop)(context));
			
			var vertBox = [6, 6];

			this.draw = {
				//split array into chunks of two, and map to lineTo for drawing
				curve : R.compose(R.map(R.apply(this.canvas('lineTo'))), this.chunk(2)),
				verts : R.compose(R.map(R.apply(this.canvas('rect'))),  R.map(R.compose(R.flip(R.concat)(vertBox), R.map(R.flip(R.subtract)(vertBox[0]/2)))), this.chunk(2))
			};
			
			context.loaded = true;
		},
		render : function(context, curvePoints, options){

			if(!context.loaded) 
				this.init(context);

			if(curvePoints.length === 2){
				this.points = [curvePoints];
				return this.paint( 'verts', this.points, options.style['verts'] );
			}

			this.points = curve( curvePoints, options['curve'] );

			this.paint( 'curve', this.points, options.style['curve'] );
			this.paint( 'verts', curvePoints, options.style['verts'] );
		},
		paint : function(drawer, points, options){
			this.configure( options );
			this.canvas('beginPath')();
			this.draw[drawer]( points );
			this.canvas('stroke')();
		},
		//partitions an array into chunks
		chunk : R.curry(function(amount, list){
			//recursive function
			var split = function(memo){
					return R.ifElse(R.compose(R.flip(R.gt)(amount), R.length, R.last), 
									R.converge(R.concat, [R.compose(R.of, R.head), R.compose(split, R.splitAt(amount), R.last)]),
									R.identity)(memo);
				};
			// check input and start recursion
			return list && list.length > amount ? R.compose(split, R.splitAt(amount))(list) : list;
		})		
	};

	// var angle =function (_pts) {
	// 	var p0 = { x : _pts[0], y : _pts[1] },
	// 		c = { x : _pts[2], y : _pts[3] },
	// 		p1 = { x : _pts[4], y : _pts[5] };

	//     var p0c = Math.sqrt(Math.pow(c.x-p0.x,2)+
	//                         Math.pow(c.y-p0.y,2)); // p0->c (b)   
	//     var p1c = Math.sqrt(Math.pow(c.x-p1.x,2)+
	//                         Math.pow(c.y-p1.y,2)); // p1->c (a)
	//     var p0p1 = Math.sqrt(Math.pow(p1.x-p0.x,2)+
	//                          Math.pow(p1.y-p0.y,2)); // p0->p1 (c)
	//     var rads = Math.acos((p1c*p1c+p0c*p0c-p0p1*p0p1)/(2*p1c*p0c));

	//     return rads*(180/Math.PI);
	// };
});