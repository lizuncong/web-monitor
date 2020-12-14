import tracker from '../utils/tracker';
import onload from '../utils/onload';

// 统计各阶段耗时
export function timing() {
  onload(function(){
    setTimeout(() => {
      const {
        connectEnd,
        connectStart,
        domComplete,
        domContentLoadedEventEnd,
        domContentLoadedEventStart,
        domInteractive,
        domLoading,
        domainLookupEnd,
        domainLookupStart,
        fetchStart,
        loadEventStart,
        redirectEnd,
        redirectStart,
        requestStart,
        responseEnd,
        responseStart,
        secureConnectionStart,
        unloadEventEnd,
        unloadEventStart
      } = performance.timing;

      tracker.send({
        kind: 'experience', // 用户体验指标
        type: 'timing', // 统计每个阶段的时间
        unLoadTime: unloadEventEnd - unloadEventStart, // 前一个页面卸载耗时
        redirectTime: redirectEnd - redirectStart, // 重定向耗时
        appCacheTime: domainLookupStart - fetchStart, // 读取缓存的时间
        dnsTime: domainLookupEnd - domainLookupStart, // DNS解析耗时
        connectTime: connectEnd - connectStart, // tpc连接耗时，建立连接的时间
        sslTime: connectEnd - secureConnectionStart, // SSL安全连接耗时
        ttfbTime: responseStart - requestStart, // 首字节到达时间
        responseTime: responseEnd - responseStart, // 响应的读取时间
        domTime: domInteractive - responseEnd, //DOM解析耗时
        resourceTime: domComplete - domContentLoadedEventEnd, // 资源加载耗时
        domReadyTime: domContentLoadedEventEnd - fetchStart, // DOM阶段渲染耗时
        firstRenderTime: responseEnd - fetchStart, // 首次渲染耗时
        parseDOMTime: loadEventStart - domLoading, // DOM解析时间
        domContentLoadedTime: domContentLoadedEventEnd - domContentLoadedEventStart,
        timeToInteractive: domInteractive - fetchStart, // 首次可交互时间
        loadTime: loadEventStart - fetchStart,  // 完整的加载时间
      })
    }, 3000)
  })
}
