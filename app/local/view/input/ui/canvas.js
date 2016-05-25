import { 
	getMouse, 
	findPoint 
} from '../../../../tool';
/**
 * @type { eventName : handler :: Event -> Action }
 */
export default {
	/**
	 * @desc check if point state.selected on mousedown
	 */	
	mousedown : function(data){

		var event = data.input,
			action = data.output,
			type  = event.index > -1 ? 'SELECT' : 'NEW_POINT',
			out  = { 
				point : event.mouse,
				index : event.index, 
				splice : false
			};

		return action(type, out);
	},
	/*
	 * @desc clear selection on mouseup
	 */
	mouseup : function(data){
		return data.output('DESELECT', { index : null });
	},
	/*
	 * @desc drag move the point if selection exists
	 */
	mousemove : function(data){
		var event = data.input,
			action = data.output,
			type = event.selects.length ? 'EDIT' : 'NOTHING',
			out = { 
				point : event.mouse, 
				splice : true 
			};
		return action(type, out);
	}
};