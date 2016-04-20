define([
	'../node_modules/ramda/dist/ramda', 
	'../node_modules/baconjs/dist/Bacon', 
	'./point'
	], function(
		R,
		B,
		point
	){
	'use strict';

	var getMouse = function(context, event){
			var client = context.canvas.getBoundingClientRect(),
				x = event.x - client.left,
				y = event.y - client.top;
			return new point(x, y);
		};

	return {
		//updateLabels :: [HTMLDivElement] -> undefined
		updateLabels : function(components){
			return R.map(this.updateLabel, components);
		},
		//displays label above slider handle
		//updateLabel :: HTMLDivElement -> undefined
		updateLabel : function(component){

			var slider = component.getElementsByTagName('input')[0],
				label = component.getElementsByClassName('label-contain')[0]
									.getElementsByTagName('label')[0],
				sbox = slider.getBoundingClientRect(),
				lbox = label.getBoundingClientRect(),
				value = Number(R.clone(slider.value)),
				data_min = slider.getAttribute('min'),
				data_max = slider.getAttribute('max'),			
				data_unit = sbox.width/Math.abs(data_max - data_min),
				label_unit = lbox.width/Math.abs(data_max - data_min),
				isFraction = slider.getAttribute('data-fractional'),
				data_value = value + (Math.abs(data_min)*(isFraction ? 1 : -1)),
				slider_pos = Math.round(data_value*(data_unit - label_unit)*100)/100,
				display_val = isFraction ? value/100 : value;

			label.style.left = slider_pos + 'px';
			label.getElementsByClassName('value')[0].innerHTML = display_val;
		}
	}
});