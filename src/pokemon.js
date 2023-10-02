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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
var formatDate = function (date) {
    return "".concat(date.getHours(), ":").concat(String(date.getMinutes()).padStart(2, '0'), " ").concat(String(date.getSeconds()).padStart(2, '0'), ".").concat(String(date.getMilliseconds()).padStart(3, '0'));
};
// the delay argument is for faking things out a bit
function fetchPokemon(name, delay) {
    var _this = this;
    if (delay === void 0) { delay = 1500; }
    var pokemonQuery = "\n    query PokemonInfo($name: String) {\n      pokemon(name: $name) {\n        id\n        number\n        name\n        image\n        attacks {\n          special {\n            name\n            type\n            damage\n          }\n        }\n      }\n    }\n  ";
    return window
        .fetch('https://graphql-pokemon2.vercel.app/', {
        // learn more about this API here: https://graphql-pokemon2.vercel.app/
        method: 'POST',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            delay: "".concat(delay),
        },
        body: JSON.stringify({
            query: pokemonQuery,
            variables: { name: name.toLowerCase() },
        }),
    })
        .then(function (response) { return __awaiter(_this, void 0, void 0, function () {
        var data, pokemon, error;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, response.json()];
                case 1:
                    data = (_b.sent()).data;
                    if (response.ok) {
                        pokemon = data === null || data === void 0 ? void 0 : data.pokemon;
                        if (pokemon) {
                            pokemon.fetchedAt = formatDate(new Date());
                            return [2 /*return*/, pokemon];
                        }
                        else {
                            return [2 /*return*/, Promise.reject(new Error("No pokemon with the name \"".concat(name, "\"")))];
                        }
                    }
                    else {
                        error = {
                            message: (_a = data === null || data === void 0 ? void 0 : data.errors) === null || _a === void 0 ? void 0 : _a.map(function (e) { return e.message; }).join('\n'),
                        };
                        return [2 /*return*/, Promise.reject(error)];
                    }
                    return [2 /*return*/];
            }
        });
    }); });
}
function PokemonInfoFallback(_a) {
    var name = _a.name;
    var initialName = React.useRef(name).current;
    var fallbackPokemonData = {
        name: initialName,
        number: 'XXX',
        image: '/img/pokemon/fallback-pokemon.jpg',
        attacks: {
            special: [
                { name: 'Loading Attack 1', type: 'Type', damage: 'XX' },
                { name: 'Loading Attack 2', type: 'Type', damage: 'XX' },
            ],
        },
        fetchedAt: 'loading...',
    };
    return _jsx(PokemonDataView, { pokemon: fallbackPokemonData });
}
function PokemonDataView(_a) {
    var pokemon = _a.pokemon;
    return (_jsxs("div", { children: [_jsx("div", { className: "pokemon-info__img-wrapper", children: _jsx("img", { src: pokemon.image, alt: pokemon.name }, pokemon.image) }), _jsx("section", { children: _jsxs("h2", { children: [pokemon.name, _jsx("sup", { children: pokemon.number })] }) }), _jsx("section", { children: _jsx("ul", { children: pokemon.attacks.special.map(function (attack) { return (_jsxs("li", { children: [_jsx("label", { children: attack.name }), ":", ' ', _jsxs("span", { children: [attack.damage, " ", _jsxs("small", { children: ["(", attack.type, ")"] })] })] }, attack.name)); }) }) }), _jsx("small", { className: "pokemon-info__fetch-time", children: pokemon.fetchedAt })] }));
}
function PokemonForm(_a) {
    var externalPokemonName = _a.pokemonName, _b = _a.initialPokemonName, initialPokemonName = _b === void 0 ? externalPokemonName || '' : _b, onSubmit = _a.onSubmit;
    var _c = React.useState(initialPokemonName), pokemonName = _c[0], setPokemonName = _c[1];
    // this is generally not a great idea. We're synchronizing state when it is
    // normally better to derive it https://kentcdodds.com/blog/dont-sync-state-derive-it
    // however, we're doing things this way to make it easier for the exercises
    // to not have to worry about the logic for this PokemonForm component.
    React.useEffect(function () {
        // note that because it's a string value, if the externalPokemonName
        // is the same as the one we're managing, this will not trigger a re-render
        if (typeof externalPokemonName === 'string') {
            setPokemonName(externalPokemonName);
        }
    }, [externalPokemonName]);
    function handleChange(e) {
        setPokemonName(e.target.value);
    }
    function handleSubmit(e) {
        e.preventDefault();
        onSubmit(pokemonName);
    }
    function handleSelect(newPokemonName) {
        setPokemonName(newPokemonName);
        onSubmit(newPokemonName);
    }
    return (_jsxs("form", { onSubmit: handleSubmit, className: "pokemon-form", children: [_jsx("label", { htmlFor: "pokemonName-input", children: "Pokemon Name" }), _jsxs("small", { children: ["Try", ' ', _jsx("button", { className: "invisible-button", type: "button", onClick: function () { return handleSelect('pikachu'); }, children: "\"pikachu\"" }), ', ', _jsx("button", { className: "invisible-button", type: "button", onClick: function () { return handleSelect('charizard'); }, children: "\"charizard\"" }), ', or ', _jsx("button", { className: "invisible-button", type: "button", onClick: function () { return handleSelect('mew'); }, children: "\"mew\"" })] }), _jsxs("div", { children: [_jsx("input", { className: "pokemonName-input", id: "pokemonName-input", name: "pokemonName", placeholder: "Pokemon Name...", value: pokemonName, onChange: handleChange }), _jsx("button", { type: "submit", disabled: !pokemonName.length, children: "Submit" })] })] }));
}
export function ErrorFallback(_a) {
    var error = _a.error, resetErrorBoundary = _a.resetErrorBoundary;
    return (_jsxs("div", { role: "alert", children: ["There was an error:", ' ', _jsx("pre", { style: { whiteSpace: 'normal' }, children: error.message }), _jsx("button", { onClick: resetErrorBoundary, children: "Try again" })] }));
}
function PokemonErrorBoundary(props) {
    return _jsx(ErrorBoundary, __assign({ FallbackComponent: ErrorFallback }, props));
}
export { PokemonInfoFallback, PokemonForm, PokemonDataView, fetchPokemon, PokemonErrorBoundary, };
