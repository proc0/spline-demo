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

	//closures to keep state
	var context,
		options,
		points = [],
		selected = [],
		//calculate mouse X Y
		getMouse = function(context, event){
			var client = context.canvas.getBoundingClientRect(),
				x = event.x - client.left,
				y = event.y - client.top;
			return new point(x, y);
		};

	return {
		//save context state and options
		init : function(_context, _options){
			context = _context;
			options = _options;
		},
		//bind an element to a Bacon Events
		bindElement : function(element, events){
			var mapEvent = function(handler, event){
					return B.fromEvent(element, event).onValue(handler);
				};
			return R.mapObjIndexed(mapEvent, events);
		},
		//bind an array of elements to Bacon events
		bindElements : function(elements, events){
			return R.map(R.flip(this.bindElement)(events), elements);
		},

		canvasEvents : {
			//new point on double click
			dblclick : function(event){
				//closure the user clicked point
				points.push(getMouse(context, event));
				//render new curve from mouse points
				return view.render(context, options, points);
			},
			//check if point selected on mousedown
			mousedown : function(event){
			
				var mouse = getMouse(context, event),
					index = view.findPoint(mouse)(points);
				//needs to store in closure to communicate 
				//to mousemove event
				return index > -1 && selected.push(index);
			},
			//clear selection on mouseup
			mouseup : function(event){
				//clear selection
				selected = [];
			},
			//drag move the point if selection exists
			mousemove : function(event){
				//update points, if one is selected
				if(selected.length){
					points.splice(selected[0], 1, getMouse(context, event))

					return view.render(context, options, points);
				}
			}
		},
		sliderEvents : {
			//closure to share 
			//between handlers
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
				var mouse = getMouse(context, event);
				if(this.slider){
					menu.updateLabel(this.slider);

					var sliderInput = this.slider.getElementsByTagName('input')[0],
						fractional = sliderInput.getAttribute('data-fractional'),
						sliderName = sliderInput.getAttribute('id'),
						value = this.slider.getElementsByTagName('input')[0].value,
						sliderVal = fractional ? value/100 : value,
						_options = { curve : {} };

					_options.curve[sliderName] = sliderVal;
					_options.curve = R.merge(options.curve, _options.curve);
					_options = R.merge(options, _options);
					options = _options;

					return view.render(context, _options, points);
				}
			}
		},
		//render with new options
		//upon checkbox change
		checkboxEvents : {
			change : function(event){
				var type = event.target.getAttribute('id'),
					val = event.target.checked;

					_options = { curve : {} };

					_options.curve[type] = val;
					_options.curve = R.merge(options.curve, _options.curve);
					_options = R.merge(options, _options);
					options = _options;

					return view.render(context, _options, points);
			}
		}
	};

});