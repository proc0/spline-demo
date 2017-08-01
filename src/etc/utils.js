'use strict';
import R from 'ramda';
import path from 'path';

const utils = {
    checkWith : R.curry(checkWith),
    getProp : R.curry(getProp),
    deepMerge : deepMerge,
    prefixPath : prefixPath,
    sink : sink,
    reorderPairs : reorderPairs1
}

R.map(function expose(obj) {
    for (let f in obj) {
        if(!global.hasOwnProperty(f)){
            global[f] = obj[f];
        } else {
            console.warn(f + ' is already defined globally');
            global['_' + f] = obj[f];
        }
    }
}, [utils, R]);

export default true;

/**
 * @description polymorphic function takes an optional validate function, a list of prop names, and an object
 *              and iterates through object properties checking the values. If a validate function is given, 
 *              that is used, if not it is simply truthy checked.
 * @param validate{Function | Array} if Function it is used to validate, and two more args are required
 * @param props{Array | Object} if Array, validate was supplied and a third arg (obj) is expected
 * @returns {Boolean}
 */
function checkWith(validate, props){
    //note: props is a one-dimensional array
    //TODO: enhance by using getProp instead of prop, for deep checking
    const allPass = all(identity),
        checkProp = is(Function, validate) ? compose(apply(compose), prepend(validate), of, prop) : has,
        check = compose(converge(compose(allPass, flatten, Array)), map(checkProp))
        //if first arg is list, then check that list and make props the object
        //else wait for the object to be passed in by returning a function
        return is(Array, validate) ? check(validate) 
            : is(Array, props) ? (obj) => check(props) 
            : False
}

function getProp2(path, obj, defaults){

    const _get = flip(propOr(defaults || S.Nothing()));
        // foldObj = converge( reduce( _get ), [last, compose(split('.'), head)]);

    // return compose( foldObj, Array)(prop, obj);
    return reduce( _get, obj, path.split('.') );
}
/**
 *  @method
 *  @description get the property of an object, any level
 *  @param {Object} obj : the object to search the properties in
 *  @param {Array} _prop : list of strings in hierarchical descending order
 *  @returns undefined or value
 */
function getProp(str, obj){
    // reduce a list of functions that return properties w/ obj
    return reduce(flip(call), obj, map(prop, stsplit('.'))); 
}

function cloneObj(obj){
    return converge(zipObj, [keys, converge(chain, [compose(apply(flip(prop)), Array), keys])])(obj);
}
/**
 * @method
 * @desc merge two objects, overwriting the values of the first with the second object.
 * @param a {Object} - first object
 * @param b {Object} - second object that will overwrite the first object's values
 */
function deepMerge(A, B){
        // isObj :: Object -> Bool
        // return true if argument is object literal (not Array)
    const isObj = compose( equals("[object Object]"), call, bind(Object.prototype.toString) ),
        // allObj :: [Object] -> (String -> Bool)
        // returns true if both are objects
        allObj = compose( all(isObj), Array ),
        // isDefined :: a -> Bool
        // returns true if value is not undefined
        isDefined = compose( not, equals(undefined) ),
        // getValues :: Objects* -> [(String -> a)]
        // returns an array of functions that take a key 
        // and return the value of its respective object
        getValues = compose( chain(flip(prop)), Array ),
        // firstDefined :: a* -> a
        // returns the first defined element in the list
        firstDefined = compose( head, filter(isDefined), Array ),
        // areObj :: Object* -> (String -> Bool)
        // returns a function that takes a key, and uses the key on 
        // all objects to check wether they are objects (allObj)
        areObj = compose( converge(allObj), getValues ),
        // stack :: Object -> Object -> (String -> a)
        // yields a function that takes a key and will return one of the two object properties
        // returns the first object's value if it's there, else the second obj's values is used.
        stack = compose( converge(firstDefined), getValues ),
        // stackMerge :: Object -> Object -> Object
        // shallow merge '_a' into '_b' to create the new 'a'
        // this preserves '_a' properties absent in '_b'
        stackMerge = apply( flip(merge) ),
        // second_arg :: [a, b] -> [b]
        // takes a list with at least two items,
        // returns the second one
        second_arg = compose( head, tail ),
        
        // cemetery
        // areObj = function(a, b){ return function(k){ return isObj(prop(k, a)) && isObj(prop(k, b)) }; },
        // stack = function(a, b){ return function(k){ return prop(k, a) !== undefined ? prop(k, a) : prop(k, b) }; },
        // recurse = function(k){
        // use closures to get values
        //  const _a = prop(k, a),
        //  _b = prop(k, b);
        //  return merger( merge(_b, _a), _b ); 
        // },

        // recursive merge
        // merger :: Object -> Object -> Object
        merger = function(a, b){
                // use first object keys
            const keys = keys(a),
                // values :: String -> [a]
                // given a key, return a list of values
                // from closure objects (a & b)
                values = flip(pluck)([a, b]),
                // recurse :: String -> Object
                // use currunt values to call merger,
                // stackMerge the first argument to preserve missing properties
                recurse = compose( converge(merger, [stackMerge, second_arg]), values ),
                
                // get new values or recurse
                // -----------------------------------------------------------------------
                // if both keys are objects then recurse
                // else take 'b' values with 'a' values that are not present in 'b'
                new_values = map( ifElse(areObj(a, b), recurse, stack(b, a)), keys ),
                // create new object from key/value array
                c = fromPairs(zip( keys, new_values ));

            // shallow merge of 'c' into 'b' this preserves
            // properties in 'b' not present in 'c'
            return merge( b, c );
        };

    return merger(A, B);
}
/**
 * @method
 * @desc
 * @param
 */
function prefixObj(str, obj){ 
    return mapObj(concat(str), obj);
}
/**
 * @method
 * @desc
 * @param
 */
function prefixPath(str, obj){ 
    return mapObj(path.resolve, prefixObj(str, obj));
}

function sink(list, order){
  const float = function(ls, k){
        const isMatch = compose(equals(k), head, last, Array);
        return reduce( ifElse( isMatch, flip(append), flip(prepend) ), [], ls);
  };
  return reduce(float, list, reverse(order));   
}

function reorderPairs1(list, order){
  const float = function(ls, k){
        const isMatch = compose(equals(k), head, last, Array);
        return reduce( ifElse( isMatch, flip(prepend), flip(append) ), [], ls);
  };
  return reduce(float, list, reverse(order));
}

function reorderPairs2(list, order){
    const float = function(ls, k){
            const newlist = [],
                isMatch = compose(equals(k), head),
                spliceList = compose( flip(list.splice.bind(ls))(1), flip(indexOf)(ls) ),
                pushNew = newlist.push.bind(newlist);
            
            map(ifElse(isMatch, compose(pushNew, head, spliceList), identity), clone(ls));
      
            return concat(newlist, ls);
        };
  
    return reduce(float, list, reverse(order));
}
