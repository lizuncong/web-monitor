import userAgent from 'user-agent';

export const logServerPrefix = 'logs'
class SendTracker{
  constructor(){
    this.url = `http://localhost:8003/${logServerPrefix}/post`;
    this.xhr = new XMLHttpRequest;
  }

  getExtraData(){
    return {
      title: document.title,
      url: location.url,
      timestamp: Date.now(),
      userAgent: userAgent.parse(navigator.userAgent)
    }
  }

  send(data = {}){
    let extraData = this.getExtraData();
    let body = JSON.stringify({ ...extraData, ...data })
    this.xhr.open('POST', this.url, true);
    this.xhr.setRequestHeader('x-log-bodyrawsize', body.length + '');
    this.xhr.setRequestHeader('Content-Type', 'application/json'); // 会导致浏览器先发起一个options预请求
    this.xhr.onload = function(res){
      console.log('请求xhr..onload...',res)
    }
    this.xhr.onerror = function(error){
      console.log('请求xhr...onerror...', error)
    }
    this.xhr.send(body)
  }
}

export default new SendTracker();
