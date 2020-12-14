import tracker from '../utils/tracker';
import onload from '../utils/onload';

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




}
