import { R } from '../util';
import { render } from '../state/view';
import model from '../data/model';

export default {
	change : function(event){
		var opt = event.target.getAttribute('id'),
			val = event.target.checked,
			_options = { curve : {} };

			_options.curve[opt] = val;

			_options.curve = R.merge(model.options.curve, _options.curve);
			model.options = R.merge(model.options, _options);

		return render(model.context, model.options, model.points);
	}
};