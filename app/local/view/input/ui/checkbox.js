import { R } from '../../../../tool';
/**
 * @type { eventName : handler :: Event -> Maybe Model }
 */
export default {
	change : function(data){
		var event = data.input,
			action = data.output,
			optionName = event.target.getAttribute('id'),
			option = { 
				name : 'curve.' + optionName, 
				value : event.target.checked 
			};

		return action('OPTION', option);
	}
};