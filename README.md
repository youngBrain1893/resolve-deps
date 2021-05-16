## Motivation
A easy way for cli/utils to resolve dependencies.

Use [glob](https://github.com/isaacs/node-glob) for entry generate,
[precinct](https://github.com/dependents/node-precinct) for ast dependencies resolve,
[enhanced-resolve](https://github.com/webpack/enhanced-resolve) for dependencies absolute path resolve.


## Usage
```javascript
const path = require('path');
const { resolveDependenciesArray } = require('resolve-dep');
const deps = await resolveDependenciesArray({
  entry: [path.join(__dirname, 'entry.ts')],
  resolve: {
    recursion: true,
    extensions: ['.ts'],
    ignore: (dep) => !(dep.startsWith('.') || dep.startsWith('/')),
  }
});
```

## Demos
- [Integrity Dependencies Check](./demos/integrity-check.js)

  check dependencies declaration integrity in `package.json` file when use mono-repo.

## License
MIT
