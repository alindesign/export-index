# Export Index

Export index is a very simple tool to generate index files for your project directories.
This is useful when you have a lot of files in a directory, and you want to generate an
index file to quickly navigate through the files.

## Installation

```bash
pnpm add -D export-index
```

## Usage
```
./your-project
├── src
│   ├── bar.ts
│   └── foo.ts
└── .indexrc
```

```typescript
// bar.ts
export type Foo = {};

export interface Bar {}

export class FooBar {}

export function baz() {
  return {};
}

export const barBaz = {};

export const fooBar = () => {
  return {};
};
```

```typescript
// foo.ts
import { fooBar } from "./bar";

export default fooBar;
```

```json5
// .indexrc (generated with `npx export-index --init`)
{
    "language": "typescript",
    "exportFormat": "all",
    "indexes": [
        {
            "dir": "src"
        }
    ]
}
```

```shell
npx export-index
cat ./src/index.ts
# // This file is generated by export-index, Do not modify this file manually
# export * from "./bar";
# export * from "./foo";
# export * from "./index";
```

## Note
- The `exportFormat` option supports only `all` for now.
- The `language` option supports only `typescript` for now.
