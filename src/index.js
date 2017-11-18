class KeyMap extends Map {
    setArray(keyArray, val) {
        this.findLeafMap(keyArray).set(keyArray[keyArray.length - 1], val);
    }

    deleteArray(keyArray) {
        this.findLeafMap(keyArray).delete(keyArray[keyArray.length - 1]);
    }

    changeArray(keyArray, newKeyArray) {
        let keyMap = this.findLeafMap(keyArray);
        let key = keyArray[keyArray.length - 1];
        let val = this.findLeafMap(keyArray).get(key);

        this.findLeafMap(keyArray).set(newKeyArray[newKeyArray.length - 1], val);
        keyMap.delete(key);
    }

    findLeafMap(keyArray) {
        return keyArray
        .slice(0, keyArray.length - 1)
        .reduce((p, c) => {
            if (!p.has(c)) {
                p.set(c, new Map());
            }
            return p.get(c);
        }, this);
    }
}

var keyMap = new KeyMap();
var currentKeyMap = keyMap;

// 退出子快捷键状态
keyMap.set('Escape', () => {
    currentKeyMap = keyMap;
});

var alias = {
    ctrl: ['control', 'ctrl'],
    meta: ['meta'],
    shift: ['shift'],
    command: ['command', 'cmd'],
    alt: ['alt']
}

var aliasMap = {};

for (let key of alias) {
    aliasVals = alias[key];
    aliasVals.forEach(val => aliasMap[val] = key);
}

function normalizeKey(key) {
    let keys = key.split('+').map(k => {
        if (aliasMap[k.toLowerCase()]) {
            return aliasMap[k];
        }
        return k;
    });
    return keys.slice(0, keys.length - 1).sort().push(keys[keys.length - 1]).join('+');
}

function parseKey(keyString) {
    let keyArray = keyString.split('!').map(key => key.trim());
    return keyArray.map(normalizeKey);
}

function bindKey(keys, handle, description = '') {
    let keysArray = [];
    if (typeof keys === 'string') {
        keysArray = keys.split(',');
    } else if (keys instanceof Array) {
        keysArray = keys;
    }

    keysArray
    .map(keys => keys.trim())
    .forEach(keyString => {
        keyCombines = parseKey(keyString);
        keyMap.setArray(keyCombines, {
            handle,
            description
        })
    });
}

function bindKeys(bindList) {
    bindList.forEach(bindKey.apply.bind(bindKey));
}

function changeKey(keyString, newKeyString) {
    if (keyString === newKeyString) {
        return;
    }
    keyMap.changeArray(parseKey(keyString), parseKey(newKeyString));
}

function removeKey(keyString) {
    keyMap.deleteArray(parseKey(keyString));
}

let keyPath = [];
function getKeymap(subKeyMap) {
    let result = [];
    return (subKeyMap || keyMap).forEach((v, k) => {
        if (v === undefined) {
            return;
        }
        if (v instanceof KeyMap) {
            keyPath.push(k);
            getKeymap(v);
            return;
        }
        let keyString = keyPath.join('!');
        result.push({
            key: keyString,
            description: v.description
        });
        keyPath.pop();
    });
    keyPath.pop();
}

document.documentElement.onkeyup = event => {
    let key = event.key;
    let keyArray = [];
    if (event.altKey) {
        keyArray.push('alt');
    }
    if (event.ctrlKey) {
        keyArray.push('ctrl');
    }
    if (event.metaKey) {
        keyArray.push('meta');
    }
    if (event.shiftKey) {
        keyArray.push('shift');
    }
    
    keyArray.push(key);

    let handler = currentKeyMap.get(normalizeKey(keyArray.join('+')));
    if (handler instanceof KeyMap) {
        currentKeyMap = handler;
    } else {
        handler.handle();
        currentKeyMap = keyMap;
    }
};

export default {
    bindKey,
    bindKeys,
    changeKey,
    deleteKey,
    getKeymap
}