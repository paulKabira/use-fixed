---
title: How it works
---

## How it works

The library only contains 2 publicly exported methods & 1 private method, each of those do not exceed more than 4 lines. Internally, **useRef** and **useCallback** are used to create _fixed_ references. The overall idea is to internally invalidate the callback reference _every time_ the component function is called in a render phase. So anytime a render happens, irrespective of commit, the function gets updated.
