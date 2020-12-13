function getSelectors(path){
  return path
      .reverse()
      .filter(element => {
        return element !== document && element !== window
      })
      .map(element => {
        let selector = '';
        if(element.id){
          return `${element.tagName.toLowerCase()}#${element.id}`
        } else if (element.className && typeof element.className === 'string'){
          return `${element.tagName.toLowerCase()}.${element.className}`
        } else {
          selector = element.nodeName.toLowerCase()
        }
        return selector
      })
      .join(' ')
}

export default function(path){
  if(Array.isArray(path)){
    return getSelectors(path);
  } else {
    let temp = [];
    while(path){
      temp.push(path)
      path = path.parentNode;
    }
    return getSelectors(temp)
  }
}
