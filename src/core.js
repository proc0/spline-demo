import { B, Cyto, Cell, Colony, State } from './etc';
import cells from './cell';
import ios from './io';
import options from '../options';

const IO = {
        input: 'L',
        output: 'R'
    },
    SEED = {
        input : [], 
        output : [] 
    },
    app = new Cyto({ 
        state : {
            name: 'core',
            options : options
        }, 
        input : cells, 
        output : ios 
    });

export default init(app);

function init(app){
    const ui = app.focus(['L', 'R', 'L']),
        dna = reduce(harvest, SEED)
        // dna = compose(mapObjIndexed(reduce(concat, [])), reduce(harvest, SEED))
        // pipeline = buildPipeline(concat(dna.input, reverse(dna.output)));
    
    // return bind(pipeline, ui);
    return bind(dna(app), ui)
}


function harvest(a, b){

    const harvester = seed => state => {
        const cyto = state.meta

        return cyto
    }

    // const harvester = seed => {
    //     return (node) => {
    //         const harvestCrops = (vector, io) => {
    //             const focus = invoker(1, 'focus'),
    //                 getIO = flip(focus)(node.meta),
    //                 commute = ifElse(is(Colony), focus(vector), F),
    //                 isCells = and(is(Array), compose(is(Cell), head)),
    //                 getCells = compose(filter(isCells), map(commute), map(getIO)),
    //                 harvestCells = compose(getCells, values),

    //                 round =  prop(vector, { 
    //                     'L' : Math.floor.bind(Math), 
    //                     'R' : Math.ceil.bind(Math) 
    //                 }),
    //                 divBy2 = compose(round, flip(divide)(2)),
    //                 getMedian = compose(divBy2, flip(or)(0), _length),
    //                 prepMerge = flip(call)([getMedian, identity]),
    //                 mergeCells = compose(prepMerge, converge, flip(insert)),
    //                 farmCells = compose(mergeCells, harvestCells)

    //             return farmCells(IO)(seed[io])
    //         },
    //         check = filter(and(is(Array), compose(identity, _length))),
    //         farm = mapObjIndexed(compose(check, harvestCrops)),
    //         produce = compose(check, farm)

    //         return produce(IO)
    //     }
    // }

    return ifElse(is(State), harvester, always(a))(b)


    // if(b instanceof State){
    //     const o = b.meta.focus('R'),
    //         i = b.meta.focus('L'),           
    //         oo = o instanceof Colony ? o.focus('R') : null,
    //         io = i instanceof Colony ? i.focus('R') : null,
    //         oi = o instanceof Colony ? o.focus('L') : null,
    //         ii = i instanceof Colony ? i.focus('L') : null

    //     if(oi instanceof Array && oi[0] instanceof Cell){
    //         a.input = insert(Math.floor(a.input.length/2), oi, a.input)
    //     }
    //     if(ii instanceof Array && ii[0] instanceof Cell){
    //         a.input = insert(Math.floor(a.input.length/2), ii, a.input)
    //     }

    //     if(io instanceof Array && io[0] instanceof Cell){
    //         a.output = insert(Math.ceil(a.output.length/2), io, a.output)
    //     }
    //     if(oo instanceof Array && oo[0] instanceof Cell){
    //         a.output = insert(Math.ceil(a.output.length/2), oo, a.output)
    //     }
    // }

    // return a;
}

function buildPipeline(seed){
    return seed
}

function bind(pipeline, ui){

    const getElement = function(className){ 
            return document.getElementsByClassName(className)[0]; 
        },
        initEvents = function(compEvents, compName){
            console.log(compEvents, compName);
            // const inputEvents = ui.output.value[0].input.type,
            //     htmlElement = getElement(compName),
                
            //     // getEventList = compose(flatten, values),
            //     filterFields = filter(compose(not, equals('type'))),
            //     filterEvents = converge(compose(filterFields, intersection), [compose(flatten, values), lst]),

            //     handlError = compose(console.log, Error),
            //     isNotEmpty = converge(and, [compose(not, isNil), compose(not, isEmpty)]),

            //     bindEvent  = function(eventName){ 
            //         return B.fromEvent(htmlElement, eventName).onValue(pipeline) 
            //     },
            //     initialize = compose(ifElse(isNotEmpty, map(bindEvent), handlError), filterEvents);

            // return initialize( inputEvents, compEvents );
        },
        //TODO: cleanup method of initializing dom elements with comp states
        initUI = compose(mapObjIndexed(initEvents), prop('proc'));
    //iterate through all ui elements, for each one get the muiing
    //which contains a map from the comp's css class to event names
    return map(initUI, ui);
}
