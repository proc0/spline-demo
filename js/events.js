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

	var context,
		options,
		points = [],
		selected = [],
		getMouse = function(context, event){
			var client = context.canvas.getBoundingClientRect(),
				x = event.x - client.left,
				y = event.y - client.top;
			return new point(x, y);
		},
		mouseHandlers = {
			mousemove : function(event){
				var mouse = getMouse(context, event);

				if(selected.length > 0){

					points.splice(selected[0], 1, mouse);
					
					return view.render(context, points, options);
				}
			},
			focus : function(event){
				var _slider = event.target.parentElement.parentElement;
				this.slider = event.type === 'mousedown' ? _slider : false;
			}
		};

	return {
		init : function(_context, _options){
			context = _context;
			options = _options;
		},

		bindElement : function(element, events){
			var mapEvent = function(handler, event){
					return B.fromEvent(element, event).onValue(handler);
				};
			return R.mapObjIndexed(mapEvent, events);
		},

		bindElements : function(elements, events){
			return R.map(R.flip(this.bindElement)(events), elements);
		},

		canvasEvents : {
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
			mousedown : function(event){
			
				var search = view.findPoint(getMouse(context, event)),
					index = points.length ? search(points) : -1;

				return selected.push(index);
			},
			mouseup : function(event){ 
				selected = [];
			},
			mousemove : mouseHandlers.mousemove
		},
		menuEvents : {
			mousemove : mouseHandlers.mousemove
		},
		sliderEvents : {
			mouseup   : mouseHandlers.focus,
			mousedown : mouseHandlers.focus,
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

					return view.render(context, points, _options);
				}
			}
		},
		checkboxEvents : {
			change : function(event){
				var type = event.target.getAttribute('id'),
					val = event.target.checked;

					_options = { curve : {} };

					_options.curve[type] = val;
					_options.curve = R.merge(options.curve, _options.curve);
					_options = R.merge(options, _options);
					options = _options;

					return view.render(context, points, _options);
			}
		}
	};

});