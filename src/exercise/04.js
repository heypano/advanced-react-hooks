import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// useLayoutEffect: auto-scrolling textarea
// http://localhost:3000/isolated/exercise/04.js
import * as React from 'react';
function MessagesDisplay(_a) {
    var messages = _a.messages;
    var containerRef = React.useRef(null);
    // 🐨 replace useEffect with useLayoutEffect
    React.useEffect(function () {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    });
    return (_jsx("div", { ref: containerRef, role: "log", children: messages.map(function (message, index, array) { return (_jsxs("div", { children: [_jsx("strong", { children: message.author }), ": ", _jsx("span", { children: message.content }), array.length - 1 === index ? null : _jsx("hr", {})] }, message.id)); }) }));
}
// this is to simulate major computation/big rendering tree/etc.
function sleep(time) {
    if (time === void 0) { time = 0; }
    var wakeUpTime = Date.now() + time;
    while (Date.now() < wakeUpTime) { }
}
function SlooooowSibling() {
    // try this with useLayoutEffect as well to see
    // how it impacts interactivity of the page before updates.
    React.useEffect(function () {
        // increase this number to see a more stark difference
        sleep(1300);
    });
    return null;
}
function App() {
    var _a = React.useState(allMessages.slice(0, 8)), messages = _a[0], setMessages = _a[1];
    var addMessage = function () {
        return messages.length < allMessages.length
            ? setMessages(allMessages.slice(0, messages.length + 1))
            : null;
    };
    var removeMessage = function () {
        return messages.length > 0
            ? setMessages(allMessages.slice(0, messages.length - 1))
            : null;
    };
    return (_jsxs("div", { className: "messaging-app", children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [_jsx("button", { onClick: addMessage, children: "add message" }), _jsx("button", { onClick: removeMessage, children: "remove message" })] }), _jsx("hr", {}), _jsx(MessagesDisplay, { messages: messages }), _jsx(SlooooowSibling, {})] }));
}
export default App;
var allMessages = [
    "Leia: Aren't you a little short to be a stormtrooper?",
    "Luke: What? Oh... the uniform. I'm Luke Skywalker. I'm here to rescue you.",
    "Leia: You're who?",
    "Luke: I'm here to rescue you. I've got your R2 unit. I'm here with Ben Kenobi.",
    "Leia: Ben Kenobi is here! Where is he?",
    "Luke: Come on!",
    "Luke: Will you forget it? I already tried it. It's magnetically sealed!",
    "Leia: Put that thing away! You're going to get us all killed.",
    "Han: Absolutely, Your Worship. Look, I had everything under control until you led us down here. You know, it's not going to take them long to figure out what happened to us.",
    "Leia: It could be worse...",
    "Han: It's worse.",
    "Luke: There's something alive in here!",
    "Han: That's your imagination.",
    "Luke: Something just moves past my leg! Look! Did you see that?",
    "Han: What?",
    "Luke: Help!",
    "Han: Luke! Luke! Luke!",
    "Leia: Luke!",
    "Leia: Luke, Luke, grab a hold of this.",
    "Luke: Blast it, will you! My gun's jammed.",
    "Han: Where?",
    "Luke: Anywhere! Oh!!",
    "Han: Luke! Luke!",
    "Leia: Grab him!",
    "Leia: What happened?",
    "Luke: I don't know, it just let go of me and disappeared...",
    "Han: I've got a very bad feeling about this.",
    "Luke: The walls are moving!",
    "Leia: Don't just stand there. Try to brace it with something.",
    "Luke: Wait a minute!",
    "Luke: Threepio! Come in Threepio! Threepio! Where could he be?",
].map(function (m, i) { return ({ id: i, author: m.split(': ')[0], content: m.split(': ')[1] }); });
