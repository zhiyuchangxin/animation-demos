/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and

 * limitations under the License.
 */
 
/*
 * twine(), where |timing| is a web-animations timing dictionary with extra
 * properties that allow the custom control/ease of arbitrary js objects or dom
 * elements via the web animations API.
 *
 *   context: arbitrary |js-object| or |dom-element| [optional]
 *   timing.onstart: callback |function| when the animation starts [optional]
 *   timing.oniteration: callback |function| on animation iteration [optional]
 *   timing.onend: callback |function| when animation completes [optional]
 *   timing.delay: initial animation delay |float| in seconds [optional]
 *   timing.to: target |object| of context properties to animate [optional]
 *   timing.easing: |string| easing name [optional]
 *   timing.onupdate: callback |function| on animation updates [optional]
 *   duration: animation duration |float| in seconds [optional]
 *
 *  Return a web-animation object with a start() method to start it playing
 *  on the document timeline.
 */

twine = function(context, timing, duration) {
  (timing = timing || {});
  timing.duration = duration || "auto";
  if (timing.easing)
    timing.timingFunction = timing.easing;
  if (timing.delay)
    timing.startDelay = timing.delay;

  // FIXME: Working around limitation in polyfill.
  var dummyElement = document.createElement('div');
  var anim = new KeyframeEffect(dummyElement, [], timing);
  anim.onsample = onsample;

  anim._valuesEnd = {};
  for (var property in timing.to)
    if (context && context[property] !== null && timing.to[property] !== null)
      anim._valuesEnd[property] = timing.to[property];

  anim.start = function() {
    anim._valuesStart = {}, anim._valuesDelta = {};
    for (var property in anim._valuesEnd) {
      anim._valuesStart[property] = context[property];
      anim._valuesDelta[property] = anim._valuesEnd[property] - context[property];
    }
    var player =  document.timeline.play(anim);
    if (typeof timing.onend === 'function')
      player.addEventListener('finish', timing.onend);
    return player, anim;
  };

  function onsample(fraction) {
    function customize(fraction) { return { ease: fraction } };
    if (typeof timing.onupdate === 'function')
      fraction = customize(timing.onupdate(fraction, 0, context)).ease || fraction;
    for (property in anim._valuesDelta)
      context[property] = anim._valuesStart[property] + anim._valuesDelta[property] * fraction;
  }

  return anim;
};
