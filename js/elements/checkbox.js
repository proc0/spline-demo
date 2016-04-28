import R from '../../node_modules/ramda/dist/ramda';
import view from '../view';
import closures from '../closures';

export default {
	change : function(event){
		var opt = event.target.getAttribute('id'),
			val = event.target.checked,
			_options = { curve : {} };

			_options.curve[opt] = val;

			_options.curve = R.merge(closures.options.curve, _options.curve);
			closures.options = R.merge(closures.options, _options);

			return view.render(closures.context, closures.options, closures.points);
	}
};