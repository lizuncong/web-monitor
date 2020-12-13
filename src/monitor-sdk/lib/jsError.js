import getLastEvent from '../utils/getLastEvent';
import getSelector from '../utils/getSelector';
import tracker from '../utils/tracker';

function getStackLines(stack = ""){
  return stack
      .split('\n')
      .slice(1)
      .map(item => item.replace(/^\s+at\s+/g, "")).join('^')
}
/**
 * 监听全局未捕获的错误
 * */
export function injectJsError() {
  // error 监听js执行抛出的未被捕获的错误，包括throw err等。
  // addEventListener第三个参数设置为true，才能捕获到资源下载错误的异常
  window.addEventListener('error', function(event){
    console.log('未捕获的js异常。。', event)
    let lastEvent = getLastEvent(); // 最后一个交互事件

    // 脚本加载错误
    if(event.target && (event.target.src || event.target.href)){
      tracker.send({
        kind: "stability", // 监控指标的大类
        type: "error", // 小类型，这是一个错误
        errorType: "resourceError", // 错误类型，资源加载错误
        filename: event.target.src || event.target.href, // 访问的文件名
        tagName: event.target.tagName,
        selector: lastEvent ? getSelector(lastEvent.path) : '', // 选择器
      });
      return;
    }

    tracker.send({
      kind: "stability", // 监控指标的大类
      type: "error", // 小类型，这是一个错误
      errorType: "jsError", // 错误类型，JS执行错误
      url: "http://localhost:8080", // 页面url
      message: event.message, // 报错信息
      filename: event.filename, // 访问的文件名
      position: `lineNo：${event.lineno}；colNo：${event.colno}`, // 行列信息
      stack: getStackLines(event.error.stack),
      selector: getSelector(event.target), // 选择器
    });
  }, true)

  // unhandledrejection。捕获promise异常。当Promise 被 reject 且没有 reject 处理器的时候，
  // 会触发 unhandledrejection 事件
  window.addEventListener('unhandledrejection', function(event){
    console.log('未捕获的promise异常', event);
    let lastEvent = getLastEvent();
    let message;
    let filename;
    let lineno = 0;
    let colno = 0;
    let stack = '';
    let reason = event.reason;
    if(typeof reason === 'string'){
      message = reason;
    } else if(typeof reason === 'object'){
      if(reason.stack){
        let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/)
        filename = matchResult[1];
        lineno = matchResult[2]
        colno = matchResult[3]
      }
      message = reason.message;
      stack = getStackLines(reason.stack);
    }

    tracker.send({
      kind: "stability", // 监控指标的大类
      type: "error", // 小类型，这是一个错误
      errorType: "promiseError", // 错误类型，JS执行错误
      url: "http://localhost:8080", // 页面url
      message, // 报错信息
      filename, // 访问的文件名
      position: `lineNo：${lineno}；colNo：${colno}`, // 行列信息
      stack,
      selector: lastEvent ? getSelector(lastEvent.path) : '', // 选择器
    });

  }, true)
}
