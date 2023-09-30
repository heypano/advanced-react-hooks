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
import { useCallback, useMemo, useReducer } from 'react';
export var StatusType;
(function (StatusType) {
    StatusType["idle"] = "idle";
    StatusType["pending"] = "pending";
    StatusType["resolved"] = "resolved";
    StatusType["rejected"] = "rejected";
})(StatusType || (StatusType = {}));
// 🐨 this is going to be our generic asyncReducer
export function asyncStateReducer(state, action) {
    switch (action.type) {
        case StatusType.pending: {
            return { status: StatusType.pending, data: null, error: null };
        }
        case StatusType.resolved: {
            return {
                status: StatusType.resolved,
                data: action.data,
                error: null,
            };
        }
        case 'rejected': {
            return {
                status: StatusType.rejected,
                data: null,
                error: action.error,
            };
        }
        default: {
            throw new Error("Unhandled action type: ".concat(action.type));
        }
    }
}
export function useAsync(initialState) {
    var _a = useReducer(asyncStateReducer, __assign({ status: StatusType.idle, data: null, error: null }, (initialState !== null && initialState !== void 0 ? initialState : {}))), state = _a[0], dispatch = _a[1];
    var run = useCallback(function (promise) {
        console.log('Pending');
        dispatch({ type: StatusType.pending });
        promise
            .then(function (data) {
            console.log('Resolved', data);
            dispatch({ type: StatusType.resolved, data: data });
        })
            .catch(function (error) {
            console.log('Rejected', error);
            dispatch({ type: StatusType.rejected, error: error });
        });
    }, []);
    return useMemo(function () { return (__assign(__assign({}, state), { run: run })); }, [state, run]);
}
