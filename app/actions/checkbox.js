import { R } from '../util';
import { action } from '../model';
/**
 * @type { eventName : handler :: Event -> Maybe Model }
 */
export default {
	change : function(event){
		var option = event.target.getAttribute('id'),
			value = event.target.checked;

		return action('OPTION', { name : 'curve.' + option, value : value });
	}
};