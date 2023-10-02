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
import * as React from 'react';
import { StatusType, } from './exercise/useAsync';
function useSafeDispatch(dispatch) {
    var mounted = React.useRef(false);
    React.useLayoutEffect(function () {
        mounted.current = true;
        return function () {
            mounted.current = false;
        };
    }, []);
    return React.useCallback(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return mounted.current ? dispatch.apply(void 0, args) : void 0;
    }, [dispatch]);
}
function asyncReducer(state, action) {
    switch (action.type) {
        case StatusType.pending: {
            return { status: StatusType.pending, data: null, error: null };
        }
        case StatusType.resolved: {
            return { status: StatusType.resolved, data: action.data, error: null };
        }
        case StatusType.rejected: {
            return { status: StatusType.rejected, data: null, error: action.error };
        }
        default: {
            throw new Error("Unhandled action type: ".concat(action.type));
        }
    }
}
function useAsync(initialState) {
    var _a = React.useReducer(asyncReducer, __assign({ status: StatusType.idle, data: null, error: null }, (initialState || {}))), state = _a[0], unsafeDispatch = _a[1];
    var dispatch = useSafeDispatch(unsafeDispatch);
    var data = state.data, error = state.error, status = state.status;
    var run = React.useCallback(function (promise) {
        dispatch({ type: StatusType.pending });
        promise.then(function (data) {
            dispatch({ type: StatusType.resolved, data: data });
        }, function (error) {
            dispatch({ type: StatusType.rejected, error: error });
        });
    }, [dispatch]);
    var setData = React.useCallback(function (data) { return dispatch({ type: StatusType.resolved, data: data }); }, [dispatch]);
    var setError = React.useCallback(function (error) { return dispatch({ type: StatusType.rejected, error: error }); }, [dispatch]);
    return {
        setData: setData,
        setError: setError,
        error: error,
        status: status,
        data: data,
        run: run,
    };
}
export { useAsync };
