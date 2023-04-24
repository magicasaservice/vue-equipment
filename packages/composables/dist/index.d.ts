import { MaybeElement, MaybeComputedElementRef } from '@vueuse/core';

type Easing = 'linear' | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad' | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic' | 'easeInQuart' | 'easeOutQuart' | 'easeInOutQuart' | 'easeInQuint' | 'easeOutQuint' | 'easeInOutQuint';
declare function useEasings(): {
    linear: (t: number) => number;
    easeInQuad: (t: number) => number;
    easeOutQuad: (t: number) => number;
    easeInOutQuad: (t: number) => number;
    easeInCubic: (t: number) => number;
    easeOutCubic: (t: number) => number;
    easeInOutCubic: (t: number) => number;
    easeInQuart: (t: number) => number;
    easeOutQuart: (t: number) => number;
    easeInOutQuart: (t: number) => number;
    easeInQuint: (t: number) => number;
    easeOutQuint: (t: number) => number;
    easeInOutQuint: (t: number) => number;
};

type EasingFunction = (t: number) => number;
type ScrollToParams = {
    element?: Element;
    top: number;
    duration?: number;
    easing?: Easing | EasingFunction;
    callback?: () => void;
};
type getScrollDurationParams = {
    element: Element | Window;
    top: number;
    speed: number;
};
type scrollToTargetParams = {
    target: string | Element | MaybeElement | MaybeComputedElementRef;
    parent: string | Element | Window | MaybeElement | MaybeComputedElementRef;
    offset: number;
    speed: number;
    easing?: Easing | EasingFunction;
};
declare function useScrollTo(): {
    getTopDistance: (element: Element) => number;
    getScrollDuration: ({ element, top, speed, }: getScrollDurationParams) => number;
    scrollTo: ({ element, top, duration, easing, callback, }: ScrollToParams) => void;
    scrollToTarget: ({ target, parent, offset, speed, easing, }: scrollToTargetParams) => void;
};

export { Easing, ScrollToParams, getScrollDurationParams, scrollToTargetParams, useEasings, useScrollTo };
