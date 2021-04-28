import { act, renderHook } from '@testing-library/react-hooks/native';
import test from 'ava';
import { useMemo, useState } from 'react';

import { useFixedCallback, useFixedGetter } from './index';

const useTestForFixedCallback = () => {
  const [counter, setCounter] = useState(0);
  const increment = useFixedCallback((step = 1) => setCounter(counter + step));
  return { increment, setCounter, counter };
};

const useTestForFixedGetter = () => {
  const [counter, setCounter] = useState(0);
  const getCounter = useFixedGetter(counter);
  return { getCounter, setCounter, counter };
};

test('useFixedCallback should return the same reference.', t => {
  const { result, rerender } = renderHook(useTestForFixedCallback);
  const cbRef = result.current.increment;

  act(() => {
    result.current.setCounter(10);
  });

  // Do a re-render
  rerender();

  t.deepEqual(
    result.current.increment,
    cbRef,
    `If no re-render happens, the reference should be the same`
  );
});

test('useFixedCallback should have the latest values in scope', t => {
  const { result } = renderHook(useTestForFixedCallback);

  act(() => result.current.setCounter(10));
  act(() => result.current.increment(10));

  t.is(result.current.counter, 20, 'The latest value of counter needs to be in scope.');
});

test(
  'useFixedGetter should return the same reference even if the data changes,' +
    ' and always return the latest value',
  t => {
    const { result } = renderHook(useTestForFixedGetter);
    const getterRef = result.current.getCounter;

    act(() => result.current.setCounter(20));

    t.is(result.current.getCounter, getterRef, 'Getter reference should not change');
    t.is(result.current.getCounter(), 20, 'Latest value should be returned.');
  }
);

test('useFixedGetter should return the latest value in render phase', t => {
  const { result, rerender } = renderHook(() => {
    const { getCounter, setCounter, counter } = useTestForFixedGetter();
    const alternateCounter = useMemo(() => getCounter.n() + 2, [counter]);
    return { alternateCounter, setCounter, getCounter };
  });
  rerender();
  act(() => result.current.setCounter(20));
  t.is(
    result.current.alternateCounter,
    22,
    `'useFixedGetter' not returned latest value during render. expected 22, got ${result.current.alternateCounter}`
  );
});

test('useFixedCallback should throw if the latest value is not callable', t => {
  const { result } = renderHook(() => {
    const [addNull, setAddNull] = useState(false);
    const testCb = useFixedCallback(addNull ? null : () => void 0);
    return { testCb, fail: () => setAddNull(true) };
  });
  act(() => result.current.fail());
  t.throws(
    () => act(() => result.current.testCb()),
    null,
    'Throw error when the latest value is not a callback'
  );
});
