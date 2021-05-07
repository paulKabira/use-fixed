---
title: Usage
---

Anywhere **useCallback** is used, **useFixedCallback** can be used in its place, except, if **useCallback** is used to trigger an update in a controlled component (which also should be avoided).

### useFixedCallback

```diff
import { useFixedCallback } from 'react';

const App = () => {
  const [valid, setValid] = useState(false);

- const onSubmit = useCallback(data => {
-   if (valid) apiCall(data)
-  }, [valid] )
+ const onSubmit = useFixedCallback(data => {
+   if (valid) apiCall(data)
+ })

  // ...

  return <MyForm onSubmit={onSubmit} />
};
```

### useFixedGetter
To get reference to the latest state values, you can use **useFixedGetter**

```tsx
const App = () => {
  const [counter, setCounter] = useState(0);
  const [step, setStep] = useState(1)

  const incrementByStep = s => setCounter(c => step+c)

  const state = useFixedGetter({ step, incrementByStep, counter });

  return <div>
    Counter: {counter}, Step: {step}
    <Child state={state}>
  </div>;
}

const Child = ({ state }) => {
  const onClick = () => {
    const { counter, incrementByStep, step, setStep } = state()
    incrementByStep(counter + step + 1)
    setStep(counter + step + 1)
  }

  return <button onClick={onClick}>
    Change step {state.n().step} to {state.n().step + state.n().counter + 1}
    & increment
  </button>
}
```
