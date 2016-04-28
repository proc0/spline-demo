'use strict';
import R from '../node_modules/ramda/dist/ramda';
import B from '../node_modules/baconjs/dist/Bacon';
import point from './point';

export default {
	//updateLabels :: [HTMLDivElement] -> undefined
	updateLabels : function(components){
		return R.map(this.updateLabel, components);
	},
	//displays label above slider handle
	//updateLabel :: HTMLDivElement -> undefined
	updateLabel : function(component){
			//get markup tags
		var slider 	= component.getElementsByTagName('input')[0],
			label 	= component.getElementsByTagName('label')[0],
			value 	= label.getElementsByClassName('value')[0],
			//get tag attributes
			data_min	= slider.getAttribute('min'),
			data_max	= slider.getAttribute('max'),			
			data_frac	= slider.getAttribute('data-fractional'),
			data_value	= Number(R.clone(slider.value)),
			label_value = data_frac ? data_value/100 : data_value;
		//update display values first
		value.innerHTML  = label_value;

			//calculating base values
		var slider_box 	= slider.getBoundingClientRect(),
			label_box 	= label.getBoundingClientRect(),
			base_unit 	= slider_box.width/Math.abs(data_max - data_min),
			base_value	= data_value + (Math.abs(data_min)*(data_frac ? 1 : -1)),
			label_unit 	= label_box.width/Math.abs(data_max - data_min),
			//the offset in pixels the handle of the slider will be, from left
			left_offset = Math.round(base_value*(base_unit - label_unit)*100)/100,
			//slider handle is about 15px width, offset margin by half the width (7)
			left_margin = Math.round((data_max - base_value)*7/Math.abs(data_max - data_min));
		//update offset values
		label.style.left = left_offset + 'px';
		value.style.paddingLeft = left_margin + 'px';
	}
};
