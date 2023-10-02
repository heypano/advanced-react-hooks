import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// useContext: simple Counter
// http://localhost:3000/isolated/exercise/03.js
import * as React from 'react';
// The default value is used only when the provider is missing from the tree above.
var CountContext = React.createContext(undefined);
function CountProvider(_a) {
    var children = _a.children;
    var _b = React.useState(0), count = _b[0], setCount = _b[1];
    return (_jsx(CountContext.Provider, { value: [count, setCount], children: children }));
}
function useCount() {
    var context = React.useContext(CountContext);
    if (!context) {
        throw new Error('useCount must be used within a CountProvider');
    }
    return context;
}
function CountDisplay() {
    var count = useCount()[0];
    return _jsx("div", { children: "The current count is ".concat(count) });
}
function Counter() {
    var _a = useCount(), setCount = _a[1];
    var increment = function () { return setCount(function (c) { return c + 1; }); };
    return _jsx("button", { onClick: increment, children: "Increment count" });
}
function App() {
    return (_jsx("div", { children: _jsxs(CountProvider, { children: [_jsx(CountDisplay, {}), _jsx(Counter, {})] }) }));
}
export default App;
