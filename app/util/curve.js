'use strict';
import { 
	R, 
	flatten,
	getPoints
} from './index';
import point from '../state/data/point';

	var cache = [],
		segments = 0,
		cacheSegments = function(numSegments){
			var _cache = new Float32Array((numSegments + 2) * 4),
				cachePtr = 4;

			// cache inner-loop calculations as they are based on t alone
			_cache[0] = 1;														// 1,0,0,0

			for (var i = 1; i < numSegments; i++) {

				var st = i / numSegments,
					st2 = st * st,
					st3 = st2 * st,
					st23 = st3 * 2,
					st32 = st2 * 3;

				_cache[cachePtr++] = st23 - st32 + 1;							// c1
				_cache[cachePtr++] = st32 - st23;								// c2
				_cache[cachePtr++] = st3 - 2 * st2 + st;						// c3
				_cache[cachePtr++] = st3 - st2;									// c4
			}

			_cache[++cachePtr] = 1;												// 0,1,0,0

			return _cache;
		},
		//TODO : transform into functional style
		parse = R.curry(function(options, _points) {

			var segments = options.segments,
				tension = options.tension,
				closed = options.closed,
				points = R.compose(flatten, getPoints)(_points),
				res = [];

			for (var i = 2; i < points.length; i += 2) {

				var pt1 = points[i],
					pt2 = points[i+1],
					pt3 = points[i+2],
					pt4 = points[i+3],
					t1x = (pt3 - points[i-2]) * tension,
					t1y = (pt4 - points[i-1]) * tension,
					t2x = (points[i+4] - pt1) * tension,
					t2y = (points[i+5] - pt2) * tension,
					c = 0, c1, c2, c3, c4;

				for (var t = 0; t < segments; t++) {

					c1 = cache[c++];
					c2 = cache[c++];
					c3 = cache[c++];
					c4 = cache[c++];

					var _x = c1 * pt1 + c2 * pt3 + c3 * t1x + c4 * t2x;
					// res[rPos++] = c1 * pt1 + c2 * pt3 + c3 * t1x + c4 * t2x;
					var _y = c1 * pt2 + c2 * pt4 + c3 * t1y + c4 * t2y;
					// res[rPos++] = c1 * pt2 + c2 * pt4 + c3 * t1y + c4 * t2y;
					res.push(point(_x, _y));
				}
			}

			return res;
		});			

export default function(curvePoints, curveOptions) {
	
	if(!curvePoints || !curvePoints.length)
		throw new Error('Attempted to draw a pointless curve.');

	var options = R.merge({ //defaults
			tension : 0.5,
			segments : 25,
			closed : false,
		}, curveOptions),
		//define key points
		p 	= curvePoints,
		l 	= p.length,
		p1 = p[0],
		p2 = p[1],
		p_2 = p[l-2],
		p_1 = p[l-1],
		render = R.compose(parse(options), flatten);

	if(segments !== options.segments){
		cache = cacheSegments(options.segments);
		segments = options.segments;
	}
	// points are parsed in diff order depending on whether curve is closed
	// for a closed curve, calculate last segment, and flip endpoints for main curve
	// -------------------->  [ mainCurve, closingCurve, closingPoint ]
	var points = options.closed ? [ render(p_1, p, p1), render(p_2, p_1, p1, p2), p1 ]
					 			: [ render(p1, p, p_1), p_1 ];

	return flatten( points );
};
