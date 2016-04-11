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
		getMouse = function(context, event){
			var client = context.canvas.getBoundingClientRect(),
				x = event.x - client.left,
				y = event.y - client.top;
			return new point(x, y);
		},
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
		},
		handlers = {
			dblclick : function(event){
			
				points.push(getMouse(context, event));

				return view.render(context, points, options);
			},
			mousemove : function(event){

				if(selected.length > 0){

					points.splice(selected[0], 1, getMouse(context, event));
					
					return view.render(context, points, options);
				}
			},
			mousedown : function(event){
			
				var search = view.findPoint(getMouse(context, event)),
					index = points.length ? search(points) : -1;

				return selected.push(index);
			},
			mouseup : function(event){ selected = []; },
		};

	B.fromEvent($canvas, 'dblclick').onValue(handlers.dblclick);
	B.fromEvent($canvas, 'mousedown').onValue(handlers.mousedown);
	B.fromEvent($canvas, 'mouseup').onValue(handlers.mouseup);
	B.fromEvent($canvas, 'mousemove').onValue(handlers.mousemove);

});

