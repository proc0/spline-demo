define(['../node_modules/ramda/dist/ramda'], function(R){
	
	return function(curvePoints, curveOptions) {
		
		if(!curvePoints || !curvePoints.length)
			throw new Error('Attempted to draw a pointless curve.');

		var options = R.merge({ //defaults
				tension : 0.5,
				segments : 25,
				closed : false
			}, curveOptions),

			parse = R.curry(function(options, points) {

				if(!points || !points.length)
					return points;

				var segments = options.segments,
					tension = options.tension,
					closed = options.closed,

					cache = new Float32Array((segments + 2) * 4),
					cachePtr = 4;

				// cache inner-loop calculations as they are based on t alone
				cache[0] = 1;														// 1,0,0,0

				for (var i = 1; i < segments; i++) {

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

				var length = (points.length - 2) * segments + 2 + (closed ? 2 * segments: 0),
					res = new Float32Array(length),
					rPos = 0;

				for (var i = 2, t; i < length; i += 2) {

					var pt1 = points[i],
						pt2 = points[i+1],
						pt3 = points[i+2],
						pt4 = points[i+3],

						t1x = (pt3 - points[i-2]) * tension,
						t1y = (pt4 - points[i-1]) * tension,
						t2x = (points[i+4] - pt1) * tension,
						t2y = (points[i+5] - pt2) * tension,
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

				return res;
			}),
			// shortcut functions
			flatten = R.compose(R.flatten, Array.prototype.concat.bind(Array.prototype)),			
			render = R.compose(parse(options), flatten),
			//define key points
			p 	= curvePoints,
			l 	= p.length,
			p1 	= [p[0], p[1]], //first point
			p2 	= [p[2], p[3]], //second point
			p_2 = [p[l - 4], p[l - 3]], //second to last
			p_1 = [p[l - 2], p[l - 1]], //last point
			// points are parsed in diff order depending on whether curve is closed
			// for a closed curve, calculate last segment, and flip endpoints for main curve
			// -------------------->  [ mainCurve, closingCurve, closingPoint ]
			points = options.closed ? [ render(p_1, p, p1), render(p_2, p_1, p1, p2), p1 ]
						 			: [ render(p1, p, p_1), p_1 ];

		return flatten( points );
	};
});