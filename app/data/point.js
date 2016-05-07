'use strict';

export default function Point(x, y){
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