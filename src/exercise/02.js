import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// useCallback: custom hooks
// http://localhost:3000/isolated/exercise/02.js
import * as React from 'react';
import { useEffect } from 'react';
import { fetchPokemon, PokemonDataView, PokemonErrorBoundary, PokemonForm, PokemonInfoFallback, } from '../pokemon.js';
import { StatusType, useAsync } from './useAsync';
function PokemonInfo(_a) {
    var pokemonName = _a.pokemonName;
    var initialState = {
        status: pokemonName ? StatusType.pending : StatusType.idle,
    };
    var _b = useAsync(initialState), pokemon = _b.data, status = _b.status, error = _b.error, run = _b.run;
    useEffect(function () {
        if (!pokemonName) {
            return;
        }
        run(fetchPokemon(pokemonName));
    }, [pokemonName, run]);
    switch (status) {
        case 'idle':
            return _jsx("span", { children: "Submit a pokemon" });
        case 'pending':
            return _jsx(PokemonInfoFallback, { name: pokemonName });
        case 'rejected':
            throw error;
        case 'resolved':
            if (!pokemon) {
                console.error('Error: Fetch resolved with no pokemon');
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
    return (_jsxs("div", { className: "pokemon-info-app", children: ["Callback extra 2", _jsx(PokemonForm, { pokemonName: pokemonName, onSubmit: handleSubmit }), _jsx("hr", {}), _jsx("div", { className: "pokemon-info", children: _jsx(PokemonErrorBoundary, { onReset: handleReset, resetKeys: [pokemonName], children: _jsx(PokemonInfo, { pokemonName: pokemonName }) }) })] }));
}
function AppWithUnmountCheckbox() {
    var _a = React.useState(true), mountApp = _a[0], setMountApp = _a[1];
    return (_jsxs("div", { children: [_jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: mountApp, onChange: function (e) { return setMountApp(e.target.checked); } }), ' ', "Mount Component"] }), _jsx("hr", {}), mountApp ? _jsx(App, {}) : null] }));
}
export default AppWithUnmountCheckbox;
