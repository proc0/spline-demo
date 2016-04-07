define(['../node_modules/ramda/dist/ramda'], function(R){
	'use strict';

	var canvas = document.getElementsByTagName('canvas')[0],
		context = canvas.getContext('2d');

	var input = [7948,3201,2760,7062,10007,5881,13857,1931],
		//transforming from original dimensions of 16000 x 9000 to 800 x 450
		pts = R.map(R.compose(Math.floor, R.flip(R.divide)(20)), input);

	var tension = 0.5,
		segments = input.length*2;

// var angle =function (_pts) {

// 	var p0 = { x : _pts[0], y : _pts[1] },
// 		c = { x : _pts[2], y : _pts[3] },
// 		p1 = { x : _pts[4], y : _pts[5] };

//     var p0c = Math.sqrt(Math.pow(c.x-p0.x,2)+
//                         Math.pow(c.y-p0.y,2)); // p0->c (b)   
//     var p1c = Math.sqrt(Math.pow(c.x-p1.x,2)+
//                         Math.pow(c.y-p1.y,2)); // p1->c (a)
//     var p0p1 = Math.sqrt(Math.pow(p1.x-p0.x,2)+
//                          Math.pow(p1.y-p0.y,2)); // p0->p1 (c)
//     var rads = Math.acos((p1c*p1c+p0c*p0c-p0p1*p0p1)/(2*p1c*p0c));

//     return rads*(180/Math.PI);
// };

var curve = function(points, tension, segments, close) {

	'use strict';

	var defaults = {
		tension : 0.5,
		segments : 25,
		close : false
	},
	tension = (typeof tension === 'number') ? tension : defaults.tension,
	segments = (typeof segments === 'number') ? segments : defaults.segments;

	var pts,															// for cloning point array
		i = 1,
		l = points.length,
		rPos = 0,
		rLen = (l-2) * segments + 2 + (close ? 2 * segments: 0),
		res = new Float32Array(rLen),
		cache = new Float32Array((segments + 2) * 4),
		cachePtr = 4;

	pts = points.slice(0);

	if (close) {
		pts.unshift(points[l - 1]);										// insert end point as first point
		pts.unshift(points[l - 2]);
		pts.push(points[0], points[1]); 								// first point as last point
	}
	else {
		pts.unshift(points[1]);											// copy 1. point and insert at beginning
		pts.unshift(points[0]);
		pts.push(points[l - 2], points[l - 1]);							// duplicate end-points
	}

	// cache inner-loop calculations as they are based on t alone
	cache[0] = 1;														// 1,0,0,0

	for (; i < segments; i++) {

		var st = i / segments,
			st2 = st * st,
			st3 = st2 * st,
			st23 = st3 * 2,
			st32 = st2 * 3;

		cache[cachePtr++] =	st23 - st32 + 1;							// c1
		cache[cachePtr++] =	st32 - st23;								// c2
		cache[cachePtr++] =	st3 - 2 * st2 + st;							// c3
		cache[cachePtr++] =	st3 - st2;									// c4
	}

	cache[++cachePtr] = 1;												// 0,1,0,0

	// calc. points
	parse(pts, cache, l, tension);

	if (close) {
		pts = [];
		pts.push(points[l - 4], points[l - 3],
				 points[l - 2], points[l - 1], 							// second last and last
				 points[0], points[1],
				 points[2], points[3]); 								// first and second
		parse(pts, cache, 4, tension);
	}

	function parse(pts, cache, l, tension) {

		for (var i = 2, t; i < l; i += 2) {

			var pt1 = pts[i],
				pt2 = pts[i+1],
				pt3 = pts[i+2],
				pt4 = pts[i+3],

				t1x = (pt3 - pts[i-2]) * tension,
				t1y = (pt4 - pts[i-1]) * tension,
				t2x = (pts[i+4] - pt1) * tension,
				t2y = (pts[i+5] - pt2) * tension,
				c = 0, c1, c2, c3, c4;

			for (t = 0; t < segments; t++) {

				c1 = cache[c++];
				c2 = cache[c++];
				c3 = cache[c++];
				c4 = cache[c++];

				res[rPos++] = c1 * pt1 + c2 * pt3 + c3 * t1x + c4 * t2x;
				res[rPos++] = c1 * pt2 + c2 * pt4 + c3 * t1y + c4 * t2y;
			}
		}
	}

	// add last point
	l = close ? 0 : points.length - 2;
	res[rPos++] = points[l++];
	res[rPos] = points[l];

	return res;
}

var ctx = R.compose(R.flip(R.bind)(context), R.flip(R.prop)(context)),
	setCtx = function(key, val){
		return R.prop(key, context) ? function(val){ return context[key] = val; } : function(){ return; };
	},
	makePairs = function(b, a){ 
		if(b[b.length-1] && b[b.length-1].length < 2) 
			b[b.length-1].push(a); 
		else b.push([a]); 

		return b; 
	},
	drawPts = R.compose(R.map(R.apply(ctx('lineTo'))), R.reduce(makePairs, [])),
	
	res = curve(pts, tension, segments, true);

setCtx('strokeStyle')('#6677cc');
setCtx('lineWidth')(3);
ctx('beginPath')();
ctx('moveTo')(pts[0], pts[1]);
drawPts(res);
ctx('stroke')();

});

