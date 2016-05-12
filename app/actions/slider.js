'use strict';
import { R, getMouse } from '../util';
import { action } from '../model';
/**
 * @type { eventName : handler :: Event -> Maybe Model }
 */
export default {
	//local closure var 
	//for state keeping
	slider : null,

	//clear slider selection on mouseup
	mouseup   : function(event, model){
		this.slider = null;
		return action('NOTHING');
	},
	//save slider in closure for next event
	mousedown : function(event, model){
		if(event.target.tagName === 'INPUT')
			this.slider = event.target.parentElement.parentElement;
		return action('NOTHING');
	},
	//if slider is selected, update its label 
	//on mousemove (dragging handler)
	mousemove : function(event, model){
		var mouse = getMouse(model.context, event);
		if(this.slider){
			this.updateLabel(this.slider);

			var sliderInput = this.slider.getElementsByTagName('input')[0],
				fractional = sliderInput.getAttribute('data-fractional'),
				sliderName = sliderInput.getAttribute('id'),
				value = this.slider.getElementsByTagName('input')[0].value,
				sliderVal = fractional ? value/100 : value;

			return action('OPTION', { name : 'curve.' + sliderName, value : sliderVal });
		}
		return action('NOTHING');
	},
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