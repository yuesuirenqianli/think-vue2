# think vue2

vue source code learning

- vscode debug config

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Vue",
      "file": "${workspaceFolder}/note/compiler.html",
      "runtimeArgs": ["--incognito", "--auto-open-devtools-for-tabs"]
    },
    {
      "type": "node",
      "name": "Node",
      "program": "${workspaceFolder}/note/code/State.js",
      "request": "launch",
      "skipFiles": ["<node_internals>/**"],
      "stopOnEntry": true
    }
  ]
}
```
