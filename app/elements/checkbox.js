import { R } from '../util';
import { render } from '../view';
import data from '../data';

export default {
	change : function(event){
		var opt = event.target.getAttribute('id'),
			val = event.target.checked,
			_options = { curve : {} };

			_options.curve[opt] = val;

			_options.curve = R.merge(data.options.curve, _options.curve);
			data.options = R.merge(data.options, _options);

		return render(data.context, data.options, data.points);
	}
};