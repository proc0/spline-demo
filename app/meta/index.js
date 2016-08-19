'use strict';
import R from '../../node_modules/ramda/dist/ramda';
import point from '../output/model/data/types/point';

export { default as R } from '../../node_modules/ramda/dist/ramda';
export { default as B } from '../../node_modules/baconjs/dist/Bacon';


var isCyto = function(obj){
	return obj.hasOwnProperty('state') && obj.hasOwnProperty('input') && obj.hasOwnProperty('output');
}

	var count = 0;
export var cyto = function cyto(haploid){
	console.log('loading ...' + count);
	return function(dna){
		//initializing convention...
		//if no state is passed in
		//initialize recursively by executing
		//input, output with no args
		if(!dna){
			count++;

			console.log('initializing');
			var seed = R.merge(this ? this.state : {}, haploid.state);
			//recurse
			return cyto({
				state : seed,
				input : haploid.input.bind(seed)(),
				output: haploid.output.bind(seed)()
			})(haploid);

		} else {
			count--;

			console.log('composing');
			var cell = {
				state : haploid.state instanceof Array ? R.concat(haploid.state, dna.state)
						: isCyto(haploid.state) ? R.concat(haploid.state.state, dna.state) : [haploid.state, dna.state],
				input : haploid.input instanceof Array ? R.concat(haploid.input, dna.input)
						: isCyto(haploid.input) ? R.concat(haploid.input.input, dna.input) : [haploid.input, dna.input],
				output: haploid.output instanceof Array ? R.concat(haploid.output, dna.output)
						: isCyto(haploid.output) ? R.concat(haploid.output.output, dna.input) :[haploid.output, dna.input]
			}, result = [];


			if(count === 0){
				console.log('root node.');
				// for(var i in cell.input){
				// 	if(i === 0 || i%2 === 0){
				// 		result.push(cell.input[i]);
				// 	} else {
				// 		result.push(cell.output[i-1]);
				// 		result.push(cell.input[i]);
				// 		i++;
				// 	}

				// }

				var app = R.apply(R.pipe)(R.flatten(R.zip(cell.input, cell.output))),
					allstates = R.mergeAll(cell.state);

				return app(allstates);
			} else {
				result = cell;
			}
			return result;
		}

		return console.log('void');
	};
};

//calculate mouse X Y
export var getMouse = function(context, event){
	var client = context.canvas.getBoundingClientRect(),
		x = event.x - client.left,
		y = event.y - client.top;
	return new point(x, y);
};
//get the Point class [x,y] by calling its method
export var getPoint = R.converge(R.compose(R.call, R.bind), [R.prop('get'), R.identity]);
export var getPoints = R.map(getPoint);


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
