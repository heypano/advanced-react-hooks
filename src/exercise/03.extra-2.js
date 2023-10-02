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
import { createContext, useContext, useReducer } from 'react';
var PokemonCacheContext = createContext(null);
function PokemonCacheProvider(_a) {
    var children = _a.children;
    var _b = useReducer(pokemonCacheReducer, {}), cache = _b[0], dispatch = _b[1];
    return (_jsx(PokemonCacheContext.Provider, { value: [cache, dispatch], children: children }));
}
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
function usePokemonContext() {
    var context = useContext(PokemonCacheContext);
    if (!context) {
        throw new Error('usePokemonContext must be used within a PokemonCacheProvider');
    }
    return context;
}
function PokemonInfo(_a) {
    var pokemonName = _a.pokemonName;
    var _b = usePokemonContext(), cache = _b[0], dispatch = _b[1];
    var _c = useAsync(), pokemon = _c.data, status = _c.status, error = _c.error, run = _c.run, setData = _c.setData;
    React.useEffect(function () {
        if (!pokemonName) {
            return;
        }
        else if (cache[pokemonName]) {
            console.log('from cache!');
            setData(cache[pokemonName]);
        }
        else {
            console.log('fetch!');
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
    var cache = usePokemonContext()[0];
    return (_jsxs("div", { children: ["Previous Pokemon", _jsx("ul", { style: { listStyle: 'none', paddingLeft: 0 }, children: Object.keys(cache).map(function (pokemonName) { return (_jsx("li", { style: { margin: '4px auto' }, children: _jsx("button", { style: { width: '100%' }, onClick: function () { return onSelect(pokemonName); }, children: pokemonName }) }, pokemonName)); }) })] }));
}
function PokemonSection(_a) {
    var onSelect = _a.onSelect, pokemonName = _a.pokemonName;
    return (_jsx(PokemonCacheProvider, { children: _jsxs("div", { style: { display: 'flex' }, children: [_jsx(PreviousPokemon, { onSelect: onSelect }), _jsx("div", { className: "pokemon-info", style: { marginLeft: 10 }, children: _jsx(PokemonErrorBoundary, { onReset: function () { return onSelect(''); }, resetKeys: [pokemonName], children: _jsx(PokemonInfo, { pokemonName: pokemonName }) }) })] }) }));
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
