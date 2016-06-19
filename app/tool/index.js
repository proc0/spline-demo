'use strict';
import R from '../../node_modules/ramda/dist/ramda';
import point from '../local/state/data/types/point';

//get the Point class [x,y] by calling its method
export var getPoint = R.converge(R.compose(R.call, R.bind), [R.prop('get'), R.identity]);

export var cyto = R.curry(function cyto(input, output, state){
	// return R.compose(R.apply(R.pipe(input, output)), R.merge(state));

	return {
		state : state,
		input : state.input ? R.pipe(state.input, input) : input(state),
		output : state.output ? R.pipe(state.output, output) : output(state)
	};
});

export var getPoints = R.map(getPoint);
//calculate mouse X Y
export var getMouse = function(context, event){
	var client = context.canvas.getBoundingClientRect(),
		x = event.x - client.left,
		y = event.y - client.top;
	return new point(x, y);
};

export var getProp = function (str, obj){
	// reduce a list of functions that return properties w/ obj
	return R.reduce(R.flip(R.call), obj, R.map(R.prop, str.split('.'))); 
};

export var findPoint = R.curry(function(mouse, points){
	var x = mouse.x,
		y = mouse.y,
		area = 10,

		sub_area = R.compose(R.flip(R.gt), R.flip(R.subtract)(area)),
		add_area = R.compose(R.flip(R.lt), R.flip(R.add)(area)),
		area_point = R.converge(Array, [sub_area, add_area]),
		area_curve = R.compose(R.map(R.map(area_point))),

		check_point = R.compose(R.map, R.flip(R.apply), R.of),
		check_x 	= R.compose(check_point(x), R.prop('x')),
		check_y 	= R.compose(check_point(y), R.prop('y')),
		check_curve = R.converge(R.concat, [check_x, check_y]),

		search_area = R.compose(R.map(check_curve), area_curve),

		atLeast = R.compose(R.apply(R.compose), R.append(R.filter(R.identity)), R.append(R.length), R.of, R.equals), 
		extract = R.compose(R.findIndex(R.identity), R.map(atLeast(4)));

	return extract(search_area( points ));
});
//partitions an array into chunks
export var chunk = R.curry(function(amount, list){
	//recursive function
	var split = function(list){
			var step = R.compose(split, R.splitAt(amount), R.last),
				recurse = R.converge(R.concat, [R.compose(R.of, R.head), step]),
				hasLength = R.compose(R.flip(R.gt)(amount), R.length, R.last);

			return R.ifElse(hasLength, recurse, R.identity)(list);
		},
		init = R.compose(split, R.splitAt(amount));
	// check input and start recursion
	return (list && list.length > amount) ? init(list) : (list.length === amount) ? [list] : list;
});

export var flatten = R.compose(R.flatten, Array.prototype.concat.bind(Array.prototype));

export var cloneObj = function cloneObj(obj){
	return R.converge(R.zipObj, [R.keys, R.converge(R.chain, [R.compose(R.apply(R.flip(R.prop)), Array), R.keys])])(obj);
}

export { default as R } from '../../node_modules/ramda/dist/ramda';
export { default as B } from '../../node_modules/baconjs/dist/Bacon';