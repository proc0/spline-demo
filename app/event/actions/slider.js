'use strict';
import { R, getMouse } from '../../util';
import action from '../../data/action';

var update = R.compose(action('OPTION'), getOption, updateLabel);
/**
 * @type { eventName : handler :: Event -> Maybe Model }
 */
export default {
	init : function(state){

		var checkSlider = R.compose(R.equals('slider'), R.prop('className')),
			findSliders = R.map(R.filter(checkSlider)),
			getSliders  = R.filter(R.compose(R.flip(R.gt)(0), R.length)),
			updateSliders = R.compose(updateLabels, R.head, getSliders, findSliders);

		return updateSliders(state.ui.elements);
	},
	//clear slider selection on mouseup
	mouseup   : function(event, state){
		return action('BLUR_SLIDER');
	},
	//save slider in closure for next event
	mousedown : function(event, state){
		var type = event.target.tagName === 'INPUT' ? 'FOCUS_SLIDER' : 'NOTHING';
		return action(type, event.target.parentElement.parentElement);
	},
	//if slider is selected, update its label 
	//on mousemove (dragging handler)
	mousemove : function(event, state){
		var slider = state.ui.state.slider;
		return slider ? update(slider) : action('NOTHING');
	}
};

function getOption(slider){

	var sliderInput = slider.getElementsByTagName('input')[0],
		fractional = sliderInput.getAttribute('data-fractional'),
		sliderName = sliderInput.getAttribute('id'),
		value = slider.getElementsByTagName('input')[0].value,
		sliderVal = fractional ? value/100 : value,
		option = { 
			name : 'curve.' + sliderName, 
			value : sliderVal 
		};

	return option;
}

//updateLabels :: [HTMLDivElement] -> undefined
function updateLabels(components){
	return R.map(updateLabel, components);
}

//displays label above slider handle
//updateLabel :: HTMLDivElement -> undefined
function updateLabel(component){
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

	return component;
}
