---
title: Introduction
slug: /
---

## The problem with useCallback

With introduction of react hooks, functional components got the ability to have state, side-effects & reactions. The hooks have great development experience and good code readability. Being functional components, to avoid updates due to newly created callbacks, `useCallback` was introduced.

This avoided creating a new reference to the required callback if none of the _dependencies_ in the `DependencyList` change. But in most of the cases, a callback once defined, should not be updated, because of the nature of callbacks. This library attempts to tackle that problem.

## Example
Consider an `App` component which has an `input` and `FancyButton`, where the `input` is controlled. To avoid triggering a update on `FancyButton`, a normal `useCallback` is used. 

```jsx title="App.js"
import { useCallback } from 'react';
import FancyButton from './FancyButton';

const App = () => {
  const [name, setName] = useState('');
  // The following callback has a dependency on name.
  const greet = useCallback(() => {
    alert(`Hello, ${name}!`)
  }, [name]);
  // Following can also be converted to a useCallback.
  const onNameChange = evt => setName(evt.target.value);
  return <div>
    <input value={name} onChange={onNameChange} />
    <FancyButton onClick={greet} />
  </div>
}
```

```jsx title="FancyButton.js"
const FancyButton = props => {
  // Measure metrics
  console.log(`Called ${useRef(0).current++} times`);
  return <button {...props} style={{ color: 'red' }} />
}
export default FancyButton;
```

In this scenario, the `greet` callback does not need to be updated every time the `input` changes. But, whenever `input` changes, the value of `name` updates which in turn updates `greet` and hence, the `FancyButton`. Even though react avoids UI repaint, these updates of `FancyButton` are unnecessary, as they do not have any updates to the UI.


## Solution: use-fixed

`useFixedCallback` tackles this problem by always returning the same reference. Even if the callback is updated, i.e. even if any of the values in the scope are updated, the functionality remains the same. 

```jsx title="App.js"
import { useFixedCallback } from 'use-fixed';
import FancyButton from './FancyButton';

const App = () => {
  const [name, setName] = useState('');
  // Reference does not changes for complete life-cycle
  // of App Component
  const greet = useFixedCallback(() => {
    alert(`Hello, ${name}!`);
  }); // No Dependencies 😊
  
  const onNameChange = evt => setName(evt.target.value);
  return <div>
    <input value={name} onChange={onNameChange} />
    <FancyButton onClick={greet}>Greet!</FancyButton>
  </div>
}
```
The reference to `greet` is never changed throughout the life-cycle of the component. So a cascading updated to `FancyButton` does not occur. This behavior does not change the actual purpose of `greet`. It always gets the latest value of `name` in scope and when called, alerts the same.



