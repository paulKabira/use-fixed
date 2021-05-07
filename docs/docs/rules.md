---
title: Rules of use-fixed
---

As much as we hate to have rules, the library does have a limitation. To overcome this, we have added the following set of rules. The rules are kept to a minimum here. With time, they will feel embedded.

The `FixedCallback` and `FixedGetter`, both are `Function`s. Both have one extra key called `n`, which is also a function. Both will return the same results, but can return different versions of the same result. This is because to react runs in 2 phases, the `render` phase and the `commit` phase. With [concurrent-mode](https://reactjs.org/docs/concurrent-mode-intro.html) completing development, this can mean that the `render` phases get multiple time without ever committing any dom changes. To maintain parity with this, we store 2 copies of the same data, one for **render** phase (`FixedCallback.n()` or `FixedGetter.n()`) and one for **commit** phase (`FixedCallback()` or `FixedGetter`).

Assuming that you have the following
```tsx
const greet = useFixedCallback((name=null) => `Hello ${name || stateVar}`)
```

### Rule 1: Use `.n()` in `render` phases
- in `useMemo(() => greet.n(), [])`
- in useState when initializing with a function `useState(() => greet.n())`
- in body of the functional component `return <span>greet.n('Paul')</span>;`
  

### Rule 2: Execute directly in `commit` phases
- in `useEffect(() => greet(), []);`
- in `useLayoutEffect(() => greet(), []);`
