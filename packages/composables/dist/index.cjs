'use strict';

var core = require('@vueuse/core');

function useEasings() {
  const easings = {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => --t * t * t + 1,
    easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeInQuart: (t) => t * t * t * t,
    easeOutQuart: (t) => 1 - --t * t * t * t,
    easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
    easeInQuint: (t) => t * t * t * t * t,
    easeOutQuint: (t) => 1 + --t * t * t * t * t,
    easeInOutQuint: (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
  };
  return easings;
}

const easings = useEasings();
function min(a, b) {
  return a < b ? a : b;
}
function getScrollPosition(element) {
  if (element === window) {
    return window.pageYOffset;
  } else if (element instanceof Element) {
    return element.scrollTop;
  } else {
    return 0;
  }
}
function useScrollTo() {
  function getTopDistance(element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = (document.scrollingElement || document.documentElement).scrollTop;
    return rect.top + scrollTop;
  }
  function getScrollDuration({
    element = window,
    top = 0,
    speed = 500
  }) {
    const currentPos = getScrollPosition(element);
    const distance = currentPos - top;
    const duration = Math.abs(distance / speed * 100);
    return duration;
  }
  function scrollTo({
    element = document.documentElement || document.body,
    top,
    duration = 500,
    easing = easings.linear,
    callback
  }) {
    const start = Date.now();
    const from = element.scrollTop;
    if (from === top) {
      if (callback)
        callback();
      return;
    }
    const mappedEasing = typeof easing === "string" ? easings[easing] : easing;
    const scroll = () => {
      const currentTime = Date.now();
      const time = min(1, (currentTime - start) / duration);
      const easedTime = mappedEasing(time);
      element.scroll({ top: easedTime * (top - from) + from });
      if (time < 1) {
        requestAnimationFrame(scroll);
      } else if (callback) {
        callback();
      }
    };
    requestAnimationFrame(scroll);
  }
  function scrollToTarget({
    target,
    parent = window,
    offset = 0,
    speed = 500,
    easing = easings.easeOutQuad
  }) {
    let parentEl;
    let targetEl;
    if (parent === window) {
      parentEl = parent;
    } else if (typeof parent === "string") {
      parentEl = document.querySelector(parent) || document.documentElement;
    } else {
      parentEl = core.unrefElement(parent) || document.documentElement;
    }
    if (!parentEl)
      return;
    if (typeof target === "string") {
      const queryTarget = parentEl === window ? document : parentEl;
      targetEl = queryTarget.querySelector(target);
    } else {
      targetEl = core.unrefElement(target);
    }
    if (!targetEl)
      return;
    const topDistance = getTopDistance(targetEl) - offset;
    const scrollDuration = getScrollDuration({
      element: parentEl,
      top: topDistance,
      speed
    });
    scrollTo({
      top: topDistance,
      duration: scrollDuration,
      easing
    });
  }
  return {
    getTopDistance,
    getScrollDuration,
    scrollTo,
    scrollToTarget
  };
}

exports.useEasings = useEasings;
exports.useScrollTo = useScrollTo;
