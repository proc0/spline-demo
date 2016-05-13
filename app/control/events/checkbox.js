import { R } from '../../util';
import action from '../../model/action';
/**
 * @type { eventName : handler :: Event -> Maybe Model }
 */
export default {
	change : function(event){
		var optionName = event.target.getAttribute('id'),
			option = { 
				name : 'curve.' + optionName, 
				value : event.target.checked 
			};

		return action('OPTION', option);
	}
};