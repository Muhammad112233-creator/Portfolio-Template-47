import { useLayoutEffect, useEffect } from 'react';

/** `useLayoutEffect` that does not warn during SSR. */
export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
