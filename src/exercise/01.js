var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
// useReducer: simple Counter
// http://localhost:3000/isolated/exercise/01.js
import * as React from 'react';
function reducer(state, action) {
    // const addedState = typeof payload === 'function' ? payload(state) : payload;
    var type = action.type, step = action.step;
    switch (type) {
        case 'INCREMENT':
            return __assign(__assign({}, state), { count: state.count + step });
        default:
            return state;
    }
}
function Counter(_a) {
    var _b = _a.initialCount, initialCount = _b === void 0 ? 0 : _b, _c = _a.step, step = _c === void 0 ? 1 : _c;
    var initialState = {
        count: initialCount,
    };
    var _d = React.useReducer(reducer, initialState), state = _d[0], dispatch = _d[1];
    var increment = function () { return dispatch({ type: 'INCREMENT', step: step }); };
    return _jsxs("button", { onClick: increment, children: ["a ", state.count] });
}
function App() {
    return _jsx(Counter, {});
}
export default App;
