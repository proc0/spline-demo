import { 
	getMouse, 
	findPoint 
} from '../../util';
/**
 * @type { eventName : handler :: Event -> Action }
 */
export default {
	/**
	 * @desc check if point state.selected on mousedown
	 */	
	mousedown : function(event, action){
	
		// var mouse = getMouse(state.context, event),
		// 	index = findPoint(mouse)(state.points),
			//if mouse is near curve, select it

		var type  = event.index > -1 ? 'SELECT' : 'NEW_POINT',
			data  = { 
				// point : getMouse(state.context, event),
				point : event.mouse,
				index : event.index, 
				splice : false
			};

		return action(type, data);
	},
	/*
	 * @desc clear selection on mouseup
	 */
	mouseup : function(event, action){
		return action('DESELECT', { index : null });
	},
	/*
	 * @desc drag move the point if selection exists
	 */
	mousemove : function(event, action){
		var type = event.selects.length ? 'EDIT' : 'NOTHING',
			data = { 
				point : event.mouse, 
				splice : true 
			};
		return action(type, data);
	}
};