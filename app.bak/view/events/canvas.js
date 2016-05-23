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
	mousedown : function(event, state){
	
		var mouse = getMouse(state.context, event),
			index = findPoint(mouse)(state.points),
			//if mouse is near curve, select it
			type  = index > -1 ? 'SELECT' : 'NEW_POINT',
			data  = { 
				point : getMouse(state.context, event), 
				index : index, 
				splice : false 
			};

		return state.data.action(type, data);
	},
	/*
	 * @desc clear selection on mouseup
	 */
	mouseup : function(event, state){
		return state.data.action('DESELECT', { index : null });
	},
	/*
	 * @desc drag move the point if selection exists
	 */
	mousemove : function(event, state){
		var type = state.selects.length ? 'EDIT' : 'NOTHING',
			data = { 
				point : getMouse(state.context, event), 
				splice : true 
			};
		return state.data.action(type, data);
	}
};