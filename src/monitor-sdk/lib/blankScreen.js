import tracker from '../utils/tracker';
import onload from '../utils/onload';

export function blankScreen() {
  let wrapperElements = ['html', 'body', '#root', '.content']
  let emptyPoints = 0;
  function getSelector(element){
    if(element.id){
      return '#' + id;
    }
    if(element.className){
      return '.' + element.className
    }

    return element.nodeName.toLowerCase();
  }
  function isWrapper(element){
    let selector = getSelector(element);
    if(wrapperElements.indexOf(selector) !== -1){
      emptyPoints++;
    }
  }

  onload(function(){
    for(let i = 1; i <= 9; i++){
      let xElements = document.elementsFromPoint(window.innerWidth * i / 10, window.innerHeight / 2)
      let yElements = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight * i / 10)
      isWrapper(xElements[0])
      isWrapper(yElements[0])
    }
    // 大于16就认为白屏
    if(emptyPoints > 16){
      let centerElements = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight / 2)
      tracker.send({
        kind: 'stability',
        type: 'blank',
        emptyPoints,
        screen: window.screen.width + 'X' + window.screen.height,
        viewPort: window.innerWidth + 'X' + window.innerHeight,
        selector: getSelector(centerElements[0])
      })
    }
  })
}
