define([
	'../node_modules/ramda/dist/ramda', 
	'../node_modules/baconjs/dist/Bacon', 
	'./view',
	'./point',
	'./menu'
	], function(
		R,
		B,
		view,
		point,
		menu
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
		segmentChanging = false,
		options = {
			curve : {
				tension : 0.5,
				segments : 20,
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

		mouseHandler = {
			dblclick : function(event){
			
				var mouse = getMouse(context, event),
					search = view.findPoint(mouse),
					index = -1;

				if(view.curve && view.curve.length){
					index = search(view.curve);
				}

				if(index !== -1){
					view.curve.splice(index, 1, mouse);
					return view.draw.curve(view.curve);
				} else {
					points.push(mouse);
				}

				return view.render(context, points, options);
			},
			mousemove : R.bind(function(event){
				var mouse = getMouse(context, event);

				if(selected.length > 0){

					points.splice(selected[0], 1, mouse);
					
					return view.render(context, points, options);
				}

				if(focus){
					menu.updateSlider(focus);
				}

			}, mouseHandler),
			mousedown : function(event){
			
				var search = view.findPoint(getMouse(context, event)),
					index = points.length ? search(points) : -1;

				return selected.push(index);
			},
			mouseup : function(event){ 
				selected = []; 

			}


		},
		menuHandler = {
			focus : function(event){
				menu.updateSlider(focus);
				focus = event.type === 'mousedown' ? event.target.getAttribute('id') : false;
			}
		};

	menu.init(context, options);

	B.fromEvent($canvas, 'dblclick').onValue(mouseHandler.dblclick);
	B.fromEvent($canvas, 'mousedown').onValue(mouseHandler.mousedown);
	B.fromEvent($canvas, 'mouseup').onValue(mouseHandler.mouseup);
	B.fromEvent($canvas, 'mousemove').onValue(mouseHandler.mousemove);

	var $options = document.getElementById('options'),
		$tension = document.getElementById('tension'),
		$segments = document.getElementById('segments');

	B.fromEvent($tension, 'mousedown').onValue(menuHandler.focus);
	B.fromEvent($tension, 'mouseup').onValue(menuHandler.focus);

	B.fromEvent($segments, 'mousedown').onValue(menuHandler.focus);
	B.fromEvent($segments, 'mouseup').onValue(menuHandler.focus);

	B.fromEvent($options, 'mousemove').onValue(mouseHandler.mousemove);
});

