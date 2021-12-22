"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const dvaHook = (modelParmas) => {
    modelParmas.reducers.$setState = (state, action) => {
        return {
            ...state,
            ...action.payload,
        };
    };
    let dispatch = () => { };
    const obj = modelParmas.state;
    const efKeys = Object.keys(modelParmas.effects);
    const objState = { Ef: {} };
    efKeys.forEach((k) => {
        objState.Ef[k] = (data) => dispatch({
            type: `${modelParmas.namespace}/${k}`,
            payload: data
        });
    });
    for (const k in obj) {
        objState[k] = null;
        Object.defineProperty(objState, k, {
            set: (value) => {
                dispatch({
                    type: `${modelParmas.namespace}/$setState`,
                    payload: {
                        [k]: value
                    }
                });
                return value;
            }
        });
    }
    const useMdState = (func) => {
        const res = (0, react_redux_1.useSelector)((item) => {
            const itemData = item[modelParmas.namespace];
            return func(itemData);
        }, react_redux_1.shallowEqual);
        return res;
    };
    const useBind = () => {
        dispatch = (0, react_redux_1.useDispatch)();
        return objState;
    };
    return { useBind, useMdState };
};
exports.default = dvaHook;
