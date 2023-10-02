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
// useContext: Caching response data in context
// 💯 caching in a context provider (exercise)
// http://localhost:3000/isolated/exercise/03.extra-2.js
// you can edit this here and look at the isolated page or you can copy/paste
// this in the regular exercise file.
import * as React from 'react';
import { fetchPokemon, PokemonForm, PokemonDataView, PokemonInfoFallback, PokemonErrorBoundary, } from '../pokemon';
import { useAsync } from '../utils';
function pokemonCacheReducer(state, action) {
    var _a;
    switch (action.type) {
        case 'ADD_POKEMON': {
            return __assign(__assign({}, state), (_a = {}, _a[action.pokemonName] = action.pokemonData, _a));
        }
        default: {
            throw new Error("Unhandled action type: ".concat(action.type));
        }
    }
}
function PokemonInfo(_a) {
    var pokemonName = _a.pokemonName;
    // 💣 remove the useReducer here (or move it up to your PokemonCacheProvider)
    var _b = React.useReducer(pokemonCacheReducer, {}), cache = _b[0], dispatch = _b[1];
    // 🐨 get the cache and dispatch from useContext with PokemonCacheContext
    var _c = useAsync(), pokemon = _c.data, status = _c.status, error = _c.error, run = _c.run, setData = _c.setData;
    React.useEffect(function () {
        if (!pokemonName) {
            return;
        }
        else if (cache[pokemonName]) {
            setData(cache[pokemonName]);
        }
        else {
            run(fetchPokemon(pokemonName).then(function (pokemonData) {
                dispatch({ type: 'ADD_POKEMON', pokemonName: pokemonName, pokemonData: pokemonData });
                return pokemonData;
            }));
        }
    }, [cache, pokemonName, run, setData]);
    if (status === 'idle') {
        return 'Submit a pokemon';
    }
    else if (status === 'pending') {
        return _jsx(PokemonInfoFallback, { name: pokemonName });
    }
    else if (status === 'rejected') {
        throw error;
    }
    else if (status === 'resolved' && pokemon) {
        return _jsx(PokemonDataView, { pokemon: pokemon });
    }
    throw "Unhandled pokemon status - this shouldn't happen";
}
function PreviousPokemon(_a) {
    var onSelect = _a.onSelect;
    // 🐨 get the cache from useContext with PokemonCacheContext
    var cache = {};
    return (_jsxs("div", { children: ["Previous Pokemon", _jsx("ul", { style: { listStyle: 'none', paddingLeft: 0 }, children: Object.keys(cache).map(function (pokemonName) { return (_jsx("li", { style: { margin: '4px auto' }, children: _jsx("button", { style: { width: '100%' }, onClick: function () { return onSelect(pokemonName); }, children: pokemonName }) }, pokemonName)); }) })] }));
}
function PokemonSection(_a) {
    var onSelect = _a.onSelect, pokemonName = _a.pokemonName;
    // 🐨 wrap this in the PokemonCacheProvider so the PreviousPokemon
    // and PokemonInfo components have access to that context.
    return (_jsxs("div", { style: { display: 'flex' }, children: [_jsx(PreviousPokemon, { onSelect: onSelect }), _jsx("div", { className: "pokemon-info", style: { marginLeft: 10 }, children: _jsx(PokemonErrorBoundary, { onReset: function () { return onSelect(''); }, resetKeys: [pokemonName], children: _jsx(PokemonInfo, { pokemonName: pokemonName }) }) })] }));
}
function App() {
    var _a = React.useState(''), pokemonName = _a[0], setPokemonName = _a[1];
    function handleSubmit(newPokemonName) {
        setPokemonName(newPokemonName);
    }
    function handleSelect(newPokemonName) {
        setPokemonName(newPokemonName);
    }
    return (_jsxs("div", { className: "pokemon-info-app", children: [_jsx(PokemonForm, { pokemonName: pokemonName, onSubmit: handleSubmit }), _jsx("hr", {}), _jsx(PokemonSection, { onSelect: handleSelect, pokemonName: pokemonName })] }));
}
export default App;
