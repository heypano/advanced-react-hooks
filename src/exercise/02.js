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
            // 🐨 replace "pokemon" with "data"
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
function useAsync(getPromise, initialState, deps) {
    var _a = useReducer(asyncStateReducer, initialState), state = _a[0], dispatch = _a[1];
    React.useEffect(function () {
        var promise = getPromise();
        if (promise) {
            dispatch({ type: StatusType.pending });
            promise
                .then(function (data) {
                console.log('woot', data);
                dispatch({ type: StatusType.resolved, data: data });
            })
                .catch(function (error) {
                dispatch({ type: StatusType.rejected, error: error });
            });
        }
    }, deps);
    return state;
}
function PokemonInfo(_a) {
    // 🐨 move all the code between the lines into a new useAsync function.
    // 💰 look below to see how the useAsync hook is supposed to be called
    // 💰 If you want some help, here's the function signature (or delete this
    // comment really quick if you don't want the spoiler)!
    var pokemonName = _a.pokemonName;
    // -------------------------- start --------------------------
    var initialState = {
        status: pokemonName ? StatusType.pending : StatusType.idle,
        // 🐨 this will need to be "data" instead of "pokemon"
        data: null,
        error: null,
    };
    var state = useAsync(function () {
        if (!pokemonName) {
            return;
        }
        return fetchPokemon(pokemonName);
    }, initialState, [pokemonName]);
    var pokemon = state.data, status = state.status, error = state.error;
    switch (status) {
        case 'idle':
            return _jsx("span", { children: "Submit a pokemon" });
        case 'pending':
            return _jsx(PokemonInfoFallback, { name: pokemonName });
        case 'rejected':
            throw error;
        case 'resolved':
            return _jsx(PokemonDataView, { pokemon: pokemon });
        default:
            throw new Error('This should be impossible');
    }
}
function App() {
    var _a = React.useState(''), pokemonName = _a[0], setPokemonName = _a[1];
    function handleSubmit(newPokemonName) {
        setPokemonName(newPokemonName);
    }
    function handleReset() {
        setPokemonName('');
    }
    return (_jsxs("div", { className: "pokemon-info-app", children: [_jsx(PokemonForm, { pokemonName: pokemonName, onSubmit: handleSubmit }), _jsx("hr", {}), _jsx("div", { className: "pokemon-info", children: _jsx(PokemonErrorBoundary, { onReset: handleReset, resetKeys: [pokemonName], children: _jsx(PokemonInfo, { pokemonName: pokemonName }) }) })] }));
}
function AppWithUnmountCheckbox() {
    var _a = React.useState(true), mountApp = _a[0], setMountApp = _a[1];
    return (_jsxs("div", { children: [_jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: mountApp, onChange: function (e) { return setMountApp(e.target.checked); } }), ' ', "Mount Component"] }), _jsx("hr", {}), mountApp ? _jsx(App, {}) : null] }));
}
export default AppWithUnmountCheckbox;
