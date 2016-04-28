'use strict';
import R from '../../node_modules/ramda/dist/ramda';
import view from '../view';
import menu from '../menu';
import closures from '../closures';

export default {
	//local closure var 
	//for state keeping
	slider : null,
	//clear slider selection on mouseup
	mouseup   : function(event){
		this.slider = null;
	},
	//save slider in closure for next event
	mousedown : function(event){
		if(event.target.tagName === 'INPUT')
			this.slider = event.target.parentElement.parentElement;
	},
	//if slider is selected, update its label 
	//on mousemove (dragging handler)
	mousemove : function(event){
		var mouse = view.getMouse(closures.context, event);
		if(this.slider){
			menu.updateLabel(this.slider);

			var sliderInput = this.slider.getElementsByTagName('input')[0],
				fractional = sliderInput.getAttribute('data-fractional'),
				sliderName = sliderInput.getAttribute('id'),
				value = this.slider.getElementsByTagName('input')[0].value,
				sliderVal = fractional ? value/100 : value,
				_options = { curve : {} };

			_options.curve[sliderName] = sliderVal;
			
			_options.curve = R.merge(closures.options.curve, _options.curve);
			closures.options = R.merge(closures.options, _options);

			return view.render(closures.context, closures.options, closures.points);
		}
	}
};