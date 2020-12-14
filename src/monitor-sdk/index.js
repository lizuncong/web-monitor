import { injectJsError } from './lib/jsError'
import injectXHR from './lib/xhr'
import { blankScreen } from './lib/blankScreen';
import { timing } from './lib/timing';
import { performanceTiming } from './lib/performanceTiming';

injectJsError()
injectXHR()
blankScreen()
timing() // 统计各阶段耗时
performanceTiming() // 性能指标耗时
