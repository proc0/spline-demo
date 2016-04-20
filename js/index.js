define([
	'../node_modules/ramda/dist/ramda', 
	'../node_modules/baconjs/dist/Bacon', 
	'./view',
	'./point',
	'./menu',
	'./events'
	], function(
		R,
		B,
		view,
		point,
		menu,
		events
	){
	'use strict';

	var $canvas 	= document.getElementsByTagName('canvas')[0],
		$sliders 	= document.getElementsByClassName('slider'),
		$checkboxes = document.getElementsByClassName('checkbox'),
		context = $canvas.getContext('2d'),
		options = { //defaults
			curve : {
				tension : 0.5,
				segments : 20,
				closed : true,
				showPoints : true,
				fill : false
			},
			style : {
				curve : {
					'strokeStyle' : '#f0f0f0',
					'fillStyle' : '#e9efa0',
					'lineWidth' : 2
				},				
				verts : {
					'strokeStyle' : '#aa0000',
					'lineWidth' : 1
				}
			}
		};

	//initialize UI controllers
	menu.updateLabels($sliders);
	//TODO: needs to be called twice to avoid offset?
	menu.updateLabels($sliders);
	//initialize var closures
	events.init(context, options);
	//bind events to its respective handlers
	//TODO: separate handlers?
	events.bindElement($canvas, events.canvasEvents);
	events.bindElements($sliders, events.sliderEvents);
	events.bindElements($checkboxes, events.checkboxEvents);

	return view.render(context);

});

