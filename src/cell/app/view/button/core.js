'use strict';
import { Cyto, Cell, DATA } from '../../../../etc';

export default new Cyto({
    state : {
        name: 'button'
    },
    input: new Cell({
        meta : {
            input : DATA.UI_EVENT,
            output: DATA.STATE
        },
        type: {
            '_button' : ['mousedown']
        },
        proc: {
            '_button' : function(){
                
            }
        }
    }),
    output: new Cell({
        meta : {
            input : DATA.STATE,
            output: DATA.OUTPUT
        },
        type: {},
        proc: {}
    })
})
