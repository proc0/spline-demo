define([
	'../node_modules/ramda/dist/ramda', 
	'../node_modules/baconjs/dist/Bacon', 
	'./view'
	], function(
		R,
		B,
		view
	){
	'use strict';

	var $canvas = document.getElementsByTagName('canvas')[0],
		context = $canvas.getContext('2d'),

		isHovering = function(mouseXY, points){
			var x = mouseXY[0],
				y = mouseXY[1],
				area = 10,
				
				_sub = R.compose(R.flip(R.gt), R.flip(R.subtract)(area)),
				_add = R.compose(R.flip(R.lt), R.flip(R.add)(area)),
				area_axis = R.converge(Array, [_sub, _add]),
				area_curve = R.compose(R.map(R.map(area_axis))),
				
				check_axis = R.compose(R.map, R.flip(R.apply), R.of),
				check_curve = R.converge(R.concat, [R.compose(check_axis(x), R.head), R.compose(check_axis(y), R.last)]),
				
				calculate = R.compose(R.map(check_curve), area_curve),
				
				atLeast = R.compose(R.apply(R.compose), R.append(R.filter(R.identity)), R.append(R.length), R.of, R.equals), 
				checkLength = R.compose(atLeast(1), R.map(atLeast(4)));

			return checkLength(calculate(points));
		},
	
		points = [],
		options = {
			curve : {
				tension : 0.5,
				segments : 0,
				closed : true
			},
			style : {
				curve : {
					'strokeStyle' : '#f0f0f0',
					'lineWidth' : 2
				},				
				verts : {
					'strokeStyle' : '#aa0000',
					'lineWidth' : 1
				}
			}
		};

	B.fromEvent($canvas, 'dblclick').onValue(function(context, event){
		
		var client = context.canvas.getBoundingClientRect(),
			x = event.x - client.left,
			y = event.y - client.top,
			w = context.canvas.width,
			h = context.canvas.height;

		context.clearRect(0, 0, w, h);

		points.push(x, y);
		options.curve.segments = points.length*2;

		view.render(context, points, options);
		// isHovering([x,y], view.chunk(2)(points));

	}, context);

	B.fromEvent($canvas, 'click').onValue(function(context, event){
		
		var client = context.canvas.getBoundingClientRect(),
			x = event.x - client.left,
			y = event.y - client.top,
			w = context.canvas.width,
			h = context.canvas.height,
			_points = points.length > 2 ? view.chunk(2)(points) : [points],
			hover = points.length ? isHovering([x,y], _points) : false;

		if(hover){
			console.log(event);
		}

		// context.clearRect(0, 0, w, h);

		// points.push(x, y);
		// options.curve.segments = points.length*2;

		// view.render(context, points, options);

	}, context);

});

