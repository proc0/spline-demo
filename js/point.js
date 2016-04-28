'use strict';
import R from '../node_modules/ramda/dist/ramda';

var getPoint = R.converge(R.compose(R.call.bind(R), R.bind), [R.prop('get'), R.identity]);

export default function Point(x, y){
	this.getPoint = getPoint.bind(R);
	return {
		x : x,
		y : y,
		map : function(transform){
			var p = new Float32Array([this.x, this.y]),
				_x = transform(p[0]),
				_y = transform(p[1]);

			return new Point(_x, _y);
		},
		get : function(){
			return [this.x, this.y];
		}
	};
};