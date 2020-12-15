import tracker from '../utils/tracker';
import onload from '../utils/onload';
import getLastEvent from "../utils/getLastEvent";
import getSelector from "../utils/getSelector";

// 性能指标耗时
export function performanceTiming() {
  let FMP, LCP;

  // 增加一个性能条目的观察者
  new PerformanceObserver((entryList, observer) => {
    let perfEntries = entryList.getEntries();
    FMP = perfEntries[0];
    observer.disconnect();
  }).observe({ entryTypes: ['element'] }) // 观察页面中的有意义元素

  new PerformanceObserver((entryList, observer) => {
    let perfEntries = entryList.getEntries();
    LCP = perfEntries[0];
    observer.disconnect();
  }).observe({ entryTypes: ['largest-contentful-paint'] }) // 观察页面中的有意义元素


  new PerformanceObserver((entryList, observer) => {
    let firstInput = entryList.getEntries()[0];
    console.log('first..INput..', firstInput);
    if(firstInput){
      // processingStart开始处理的时间 startTime开始点击的时间。差值就是处理的延迟
      let inputDelay = firstInput.processingStart - firstInput.startTime
      let duration = firstInput.duration; // 处理耗时
      if(inputDelay > 0 || duration > 0){
        let lastEvent = getLastEvent();
        tracker.send({
          kind: 'experience',
          type: 'firstInputDelay',
          inputDelay,
          duration,
          startTime: firstInput.startTime,
          selector: lastEvent ? getSelector(lastEvent.path || lastEvent.target) : ''
        })
      }
    }
    observer.disconnect();
  }).observe({ type: 'first-input', buffered: true }) // 观察页面中的有意义元素


  onload(function () {
    setTimeout(() => {
      // 开始发送性能指标
      let FP = performance.getEntriesByName('first-paint')[0]
      let FCP = performance.getEntriesByName('first-contentful-paint')[0]
      tracker.send({
        kind: 'experience',
        type: 'paint',
        firstPaint: FP && FP.startTime,
        firstContentfulPaint: FCP && FCP.startTime,
        firstMeaningfulPaint: FMP && FMP.startTime,
        largestContentfulPaint: LCP && LCP.startTime,
      })

    }, 3000)
  })

}
