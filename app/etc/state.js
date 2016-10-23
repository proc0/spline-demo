'use strict';

import R from '../../node_modules/ramda/dist/ramda';

export default function State(state, cyto){
	var s = this;
	s.meta = cyto;
	R.mapObjIndexed(function(val, key, obj){
		s[key] = val;
	}, state);
}