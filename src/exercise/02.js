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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js
import * as React from 'react';
import { useReducer } from 'react';
import { fetchPokemon, PokemonDataView, PokemonErrorBoundary, PokemonForm, PokemonInfoFallback, } from '../pokemon';
var StatusType;
(function (StatusType) {
    StatusType["idle"] = "idle";
    StatusType["pending"] = "pending";
    StatusType["resolved"] = "resolved";
    StatusType["rejected"] = "rejected";
})(StatusType || (StatusType = {}));
// 🐨 this is going to be our generic asyncReducer
function asyncStateReducer(state, action) {
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
function useAsync(getPromise, initialState) {
    var _a = useReducer(asyncStateReducer, __assign({ status: StatusType.idle, data: null, error: null }, (initialState !== null && initialState !== void 0 ? initialState : {}))), state = _a[0], dispatch = _a[1];
    React.useEffect(function () {
        var promise = getPromise();
        if (promise) {
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
        }
        else {
            console.log('No promise');
        }
    }, [getPromise]);
    return state;
}
function PokemonInfo(_a) {
    var pokemonName = _a.pokemonName;
    var initialState = {
        status: pokemonName ? StatusType.pending : StatusType.idle,
    };
    var asyncCallback = React.useCallback(function () {
        if (!pokemonName) {
            return;
        }
        return fetchPokemon(pokemonName);
    }, [pokemonName]);
    var state = useAsync(asyncCallback, initialState);
    var pokemon = state.data, status = state.status, error = state.error;
    switch (status) {
        case 'idle':
            return _jsx("span", { children: "Submit a pokemon" });
        case 'pending':
            return _jsx(PokemonInfoFallback, { name: pokemonName });
        case 'rejected':
            throw error;
        case 'resolved':
            if (!pokemon) {
                throw new Error('Fetch resolved with no pokemon');
            }
            return _jsx(PokemonDataView, { pokemon: pokemon });
        default:
            throw new Error('This should be impossible');
    }
}
function useLocalStorageState(key, defaultValue, 
// the = {} fixes the error we would get from destructuring when no argument was passed
// Check https://jacobparis.com/blog/destructure-arguments for a detailed explanation
_a) {
    var 
    // the = {} fixes the error we would get from destructuring when no argument was passed
    // Check https://jacobparis.com/blog/destructure-arguments for a detailed explanation
    _b = _a === void 0 ? {} : _a, _c = _b.serialize, serialize = _c === void 0 ? JSON.stringify : _c, _d = _b.deserialize, deserialize = _d === void 0 ? JSON.parse : _d;
    var _e = React.useState(function () {
        var valueInLocalStorage = window.localStorage.getItem(key);
        if (valueInLocalStorage) {
            // the try/catch is here in case the localStorage value was set before
            // we had the serialization in place (like we do in previous extra credits)
            try {
                return deserialize(valueInLocalStorage);
            }
            catch (error) {
                window.localStorage.removeItem(key);
            }
        }
        return typeof defaultValue === 'function'
            ? defaultValue()
            : defaultValue;
    }), state = _e[0], setState = _e[1];
    var prevKeyRef = React.useRef(key);
    // Check the example at src/examples/local-state-key-change.js to visualize a key change
    React.useEffect(function () {
        var prevKey = prevKeyRef.current;
        if (prevKey !== key) {
            window.localStorage.removeItem(prevKey);
        }
        prevKeyRef.current = key;
        window.localStorage.setItem(key, serialize(state));
    }, [key, state, serialize]);
    return [state, setState];
}
function App() {
    var _a = useLocalStorageState('pokemonName', ''), pokemonName = _a[0], setPokemonName = _a[1];
    function handleSubmit(newPokemonName) {
        setPokemonName(newPokemonName);
    }
    function handleReset() {
        setPokemonName('');
    }
    return (_jsxs("div", { className: "pokemon-info-app", children: ["Callback", _jsx(PokemonForm, { pokemonName: pokemonName, onSubmit: handleSubmit }), _jsx("hr", {}), _jsx("div", { className: "pokemon-info", children: _jsx(PokemonErrorBoundary, { onReset: handleReset, resetKeys: [pokemonName], children: _jsx(PokemonInfo, { pokemonName: pokemonName }) }) })] }));
}
function AppWithUnmountCheckbox() {
    var _a = React.useState(true), mountApp = _a[0], setMountApp = _a[1];
    return (_jsxs("div", { children: [_jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: mountApp, onChange: function (e) { return setMountApp(e.target.checked); } }), ' ', "Mount Component"] }), _jsx("hr", {}), mountApp ? _jsx(App, {}) : null] }));
}
export default AppWithUnmountCheckbox;
