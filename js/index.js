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

	var $canvas = document.getElementsByTagName('canvas')[0],
		context = $canvas.getContext('2d'),
		canvas = R.compose(R.flip(R.bind)(context), R.flip(R.prop)(context)),
		setContext = function(val, key, obj){
			return R.prop(key, context) ? context[key] = val : null;
		},
		configure = R.mapObjIndexed(setContext),
		//partitions an array into chunks
		splitEvery = R.curry(function(amount, list){
			//recursive function
			var split = function(memo){
				  return R.ifElse(R.compose(R.flip(R.gt)(amount), R.length, R.last), 
				                  R.converge(R.concat, [R.compose(R.of, R.head), R.compose(split, R.splitAt(amount), R.last)]),
				                  R.identity)(memo);
				};
			// check input and start recursion
			return list && list.length > amount ? R.compose(split, R.splitAt(amount))(list) : list;
		}),
		//split array into chunks of two, and map to lineTo for drawing
		drawSpline = R.compose(R.map(R.apply(canvas('lineTo'))), splitEvery(2)),
		drawVertices = R.compose(R.chain(R.apply(canvas('rect'))),  R.map(R.compose(R.flip(R.concat)([6, 6]), R.map(R.flip(R.subtract)(3)))), splitEvery(2));
	
	//DRAW
	/////////////////////////////////////////////////////////////////////////
	var renderCurve = function(points, options){
			configure(options);
			canvas('beginPath')();
			drawSpline( points );
			canvas('stroke')();
		},
		renderVertices = function(points, options){
			configure(options);
			canvas('beginPath')();
			drawVertices( points );
			canvas('stroke')();			
		},
		render = function(points, options){
			var points = curve(points, options['curve']);

			renderCurve(points, options['canvas']);
			renderVertices(points, options['vertex']);
		},
		
		testInput = [7948,3201,2760,7062,10007,5881,13857,1931],
		//transforming from original dimensions of 16000 x 9000 to 800 x 450
		testPoints = R.map(R.compose(Math.floor, R.flip(R.divide)(20)), testInput),

		testOptions = {
			canvas : {
				'strokeStyle' : '#f3f3f3',
				'lineWidth' : 3
			},
			curve : {
				tension : 0.5,
				segments : testPoints.length*2,
				closed : true
			},
			vertex : {
				'strokeStyle' : 'rgba(0,0,0,0.7)',
				'lineWidth' : 1
			}
		};

	render(testPoints, testOptions);

	Bacon.fromEvent($canvas, 'click').onValue(function(event){
		var x = event.clientX,
			y = event.clientY;

		console.log(event);
	});
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

