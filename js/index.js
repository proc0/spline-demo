define([
	'../node_modules/ramda/dist/ramda', 
	'../node_modules/baconjs/dist/Bacon', 
	'./view',
	'./point'
	], function(
		R,
		B,
		view,
		point
	){
	'use strict';

	var $canvas = document.getElementsByTagName('canvas')[0],
		context = $canvas.getContext('2d'),

		points = [],
		selected = [],
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
			y = event.y - client.top;

		points.push(new point(x, y));

		view.render(context, points, options);

	}, context);

	B.fromEvent($canvas, 'mousedown').onValue(function(context, event){
		
		var client = context.canvas.getBoundingClientRect(),
			x = event.x - client.left,
			y = event.y - client.top,
			mouse = new point(x, y),
			pointIndex = points.length ? view.findPoint(mouse, points) : -1;

		if(pointIndex !== -1){
			selected.push({ index : pointIndex, mouse : mouse });
		} else {
			selected = [];
		}

	}, context);

	B.fromEvent($canvas, 'mouseup').onValue(function(context, event){
		selected = [];
	}, context);

	window.onmousemove = function(event){

		if(selected.length > 0){

			var client = context.canvas.getBoundingClientRect(),
				x = event.x - client.left,
				y = event.y - client.top,
				w = context.canvas.width,
				h = context.canvas.height;

			points.splice(selected[0].index, 1, new point(x, y));
			
			view.render(context, points, options);
		}
	}

});

