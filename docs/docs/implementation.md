---
title: Implementation
---

## How, What & Why?

Internally, **useRef** and **useMemo** are used to create _fixed_ references. The overall idea is to internally invalidate the callback reference _every time_ react commits changes. The library is generalization of [often changing callback](https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback) pattern. The implementation is inspired by internal utilities of [react-table](https://react-table.tanstack.com/).

The **useCallback** hook is a optimization technique to add to a Component tree optimized using either `React.memo` or `shouldComponentUpdate`. This can be a hindrance to such component trees. While this will be enough for most use cases, it is rendered pointless when you have a dependency that changes a lot. (eg. an input field, timer etc.)

The `useFixedCallback` is another way to maintain the same reference. The difference between this and `useCallback` is that `useFixedCallback` does not need a dependency list, yet it always has the latest _usable state_. The reference to a `FixedCallback` never changes, and hence, such expensive component trees do not have to update, when the callback updates.

> Note: This technique is not recommended by react, but the alternative present at the moment (using `dispatch` and reducers) may not satisfies everyone's use cases. For projects that do not use the `redux` pattern for state management, and rely on hooks/setState need an alternative, which this library intends to provide.

## Principles

The callback returned by `useFixedCallback` has the following interface,

```tsx

const App = () => {
  const [counter, setCounter] = useState(0);

  const increment = useFixedCallback((by = 1) => {
    const value = counter + by;
    setState(value)
    return value;
  });

  const getCounterPowered = useFixedCallback((to = 2) => {
    return counter ** to;
  });
  
  return <>
    <h3>Value: {counter}</h3>
    <button onClick={() => increment(1)}> Increment </button>
    <PowerByNumber getPowered={getCounterPowered} />
  </>
}

export default App;

const PowerByNumber = React.memo(({ getPowered }) => {
  const [poweredBy, setPoweredBy] = useState(3)
  // consider heavy calculation here. Also, notice the n here.
  const powered = useMemo(() => getPowered.n(poweredBy), [poweredBy]);

  return <>
    <h5>Powered To 3 {getPowered.n(2)}</h5>
    <h4>Type in a number to calculate power to the counter</h4>
    <input type="number" value={poweredBy} min={3} onChange={() => setPoweredBy(evt.target.value)}>
    <h4>Powered Counter = {powered}</h4>
  </>
});
```
