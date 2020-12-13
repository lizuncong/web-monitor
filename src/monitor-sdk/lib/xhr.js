import tracker, { logServerPrefix } from '../utils/tracker';

export default function injectXHR(){
  let XMLHttpRequest = window.XMLHttpRequest;

  let oldOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, async){
    if(url.indexOf(logServerPrefix) === -1){
      this.logData = { method, url, async }
    }
    return oldOpen.apply(this, arguments)
  }


  let oldSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(body){
    if(this.logData){
      let startTime = Date.now();
      let handler = (type) => (event) => {
        let duration = Date.now() - startTime;
        let status = this.status;
        let statusText = this.statusText;

        tracker.send({
          kind: "stability",
          type: "xhr",
          eventType: type,
          pathname: this.logData.url,
          status: status + '-' + statusText,
          duration,
          response: this.response ? JSON.stringify(this.response) : '',
          params: body || ''
        })

      }
      this.addEventListener('load', handler('load'), false)
      this.addEventListener('error', handler('error'), false)
      this.addEventListener('abort', handler('abort'), false)
    }
    return oldSend.apply(this, arguments)
  }
}
