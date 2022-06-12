// Connection 负责与学而思的基本通信。
var conn_init = (function(global, ws, base64) {
  'use strict';
  global.MsgEvent = function(type, content = '') {
    this.data = content;
    this.type = type;
  };
  global.Connection = function(content, iscpp) {
    'use strict';
    this.onmessage = () => {};
    this.onclose = () => {};
    this.onerror = () => {};
    this.onopen = () => {};
    // ws init
    var _baseWs = new ws('wss://codedynamic.xueersi.com/api/compileapi/ws/run');
    _baseWs.onopen = () => {
      'use strict';
      _baseWs.send('{}');
      _baseWs.send('7' + JSON.stringify({
        'xml': content,
        'type': 'run',
        'lang': iscpp ? 'cpp' : 'python',
        'original_id': 1
      }));
      this.onopen();
    };
    _baseWs.onmessage = (ev) => {
      'use strict';
      switch (ev.data[0]) {
        case '1': {
          let data = base64.decode(ev.data.substring(1));
          if (!this._sended)
            return this.onmessage(new MsgEvent('Output', data));
          this._sended = false;
        }
        case '7':
          return this.onmessage(
              new MsgEvent('System', base64.decode(ev.data.substring(1))));
        case '3':
          return this.onmessage(new MsgEvent('Closed'));
        case '2':
          return;
        default:
          return this.onmessage(new MsgEvent('Unknown', ev.data));
      }
    };
    _baseWs.onclose = () => {
      'use strict';
      clearInterval(this._heartbeatInv);
      this.onclose();
    };
    this._sended = true;
    _baseWs.onerror = () => this.onerror();
    this._heartbeatInv =
        setInterval(() => _baseWs.send('2'), 10000);  // heartbeat
    this.send = (val) => {
      'use strict';
      _baseWs.send('1' + val);
      this._sended = true;
    };
    this.close = () => {
      'use strict';
      _baseWs.send('0');
      _baseWs.close();
    };
  };
});