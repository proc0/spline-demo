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
		init : function(context, options){
			
			// this.$labeltension = document.getElementsByClassName('slider')[1].getElementsByClassName('value')[0];
			this.$inputtension = document.getElementsByClassName('slider')[1];

			// this.$labelsegments = document.getElementsByClassName('slider')[0].getElementsByClassName('value')[0];
			this.$inputsegments = document.getElementsByClassName('slider')[0];
				
			this.$inputtension.getElementsByTagName('input')[0].value = options.curve.tension*10;
			this.$inputsegments.getElementsByTagName('input')[0].value = options.curve.segments;

			this.updateSlider('tension');
			this.updateSlider('segments');
		},
		updateSlider(name){
			if(name === 'tension'){
				// this.$inputtension.setAttribute('value', this.$inputtension.value || options.curve.tension*10);
				this.updateLabel(this.$inputtension, this.$labeltension);
			} else if(name === 'segments'){
				// this.$inputsegments.setAttribute('value', this.$inputsegments.value || options.curve.segments);
				this.updateLabel(this.$inputsegments, this.$labelsegments);
			}
		},
		updateLabel : function(component){

			var slider = component.getElementsByTagName('input')[0],
				label = component.getElementsByClassName('label-contain')[0].getElementsByTagName('label')[0],
				sbox = slider.getBoundingClientRect(),
				lbox = label.getBoundingClientRect(),
				value = Number(R.clone(slider.value)),
				data_min = slider.getAttribute('min'),
				data_max = slider.getAttribute('max'),			
				data_unit = sbox.width/Math.abs(data_max - data_min),
				label_unit = lbox.width/Math.abs(data_max - data_min),
				data_value = value + Math.abs(data_min),
				slider_pos = Math.round(data_value*(data_unit - label_unit)*10)/10,
				
				isFraction = slider.getAttribute('data-fractional'),
				// min = isFraction ? min/10 : min,
				// max = isFraction ? max/10 : max,
				display_val = isFraction ? value/10 : value;

			// if(display_val < min || max < display_val){
				// do nothing if outside 
				// of range (excluding min max)
			// } else if(min < display_val && display_val < max){
				label.style.left = slider_pos + 'px';
				label.getElementsByClassName('value')[0].innerHTML = display_val;
			// } else {
				// label.innerHTML = display_val;
			// }
			// var decimal = input.getAttribute('data-decimal'),
			// 	value = R.clone(input.value)/(decimal ? 10 : 1),
			// 	inputrect = input.getBoundingClientRect(),
			// 	labelrect = label.getBoundingClientRect(),
			// 	data_min = input.getAttribute('min'),
			// 	data_max = input.getAttribute('max'),
			// 	min = data_min/(decimal ? 10 : 1),
			// 	max = data_max/(decimal ? 10 : 1),
			// 	unit = Math.round(inputrect.width*input.value)/(data_max-data_min+1),
			// 	value_pos = new point(unit, 0),
			// 	offset = value_pos.x + 'px';
		
			// if(value < min || max < value){
			// 	// do nothing if outside 
			// 	// of range (excluding min max)
			// } else if(min < value && value < max){
			// 	label.style.left = offset;
			// 	label.innerHTML = value;
			// } else {
			// 	label.innerHTML = value;
			// }
		}
	}
});