# key-binding
一个简易的快捷键管理库。

## 绑定快捷键
```javascript
// bindkey(key(s), handle, description);

// example:
bindKey('a', () => {}, 'do something');

bindKey('ctrl+a', () => {}, 'do another thing');

bindKey('ctrl+a!ctrl+b', () => {}, 'ctrl+a to enter sub mode then ctrl+b');

bindKey('ctrl+a, ctrl+c', () => {}, 'ctrl+a and ctrl+c do the same thing');

bindKey(['ctrl+a', 'ctrl+c'], () => {}, 'also can express keys with array');

// bind many keys at once
bindKeys([
    ['a', () => {}, 'do something'],
    ['ctrl+a!ctrl+b', () => {}, 'ctrl+a to enter sub mode then ctrl+b'],
]);
```