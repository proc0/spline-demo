import { default } from '../utils';

export default class USER_EVENT {
    constructor(props){
        return map(function(prop){ 
            this[prop[0]] = prop[1]
        }.bind(this), toPairs(props))
    }
}