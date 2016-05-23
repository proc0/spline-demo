import { R } from '../../util';
/**
 * @type { eventName : handler :: Event -> Maybe Model }
 */
export default {
	change : function(event, state){
		var optionName = event.target.getAttribute('id'),
			option = { 
				name : 'curve.' + optionName, 
				value : event.target.checked 
			};

		return state.data.action('OPTION', option);
	}
};