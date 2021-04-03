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
