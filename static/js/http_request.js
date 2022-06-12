// 代码来自 L++
function splitBy(p, tok) {
  'use strict';
  if (tok.length != 1) throw Error('tok must be a char');
  var z = false, j = 0, a = 0, i = 0;
  var temp = '', ret = [];
  for (var i = 0; i < p.length; i++) {
    if (p[i] == '\\')
      z = !z;
    else if (p[i] == '\"' && !z) {
      if (a == 0 || a == 1) a = !a;
    } else if (p[i] == '\'' && !z) {
      if (a == 0 || a == 2) a = ((!a) == 1 ? 2 : 0);
    } else
      z = false;
    if ((p[i] == '(' || p[i] == '{' || p[i] == '[') && a == 0)
      j++;
    else if ((p[i] == ')' || p[i] == '}' || p[i] == ']') && a == 0)
      j--;
    if (p[i] == tok && a == 0 && j == 0) {
      ret.push(temp);
      temp = '';
    } else
      temp += p[i];
  }
  if (z != false || j != 0 || a != 0) throw Error('Syntax error');
  if (temp != '') ret.push(temp);
  return ret;
}
function HTTPReq(method, path, option, body) {
  'use strict';
  this.method = method;
  this.path = path;
  this.option = option;
  this.body = body;
  this.toString = () => {
    return `${this.method} ${JSON.stringify(this.path)} ${
        JSON.stringify(this.option)} ${JSON.stringify(this.body)}`;
  }
}
function ReqFromStr(str) {
  'use strict';
  // GET "/hello" {} ""
  var splited = splitBy(str, ' ');
  if (splited.length != 4) throw Error('Request format Error');
  return new HTTPReq(
      splited[0], JSON.parse(splited[1]), JSON.parse(splited[2]),
      JSON.parse(splited[3]));
}
function HTTPResp(status, option, body) {
  'use strict';
  this.status = status;
  this.option = option;
  this.body = body;
  this.toString = () => {
    return `${this.status} ${JSON.stringify(this.option)} ${
        JSON.stringify(this.body)}`;
  }
}
function RespFromStr(str) {
  'use strict';
  // 200 {} "Hello World"
  var splited = splitBy(str, ' ');
  if (splited.length != 3) throw Error('Request format Error');
  return new HTTPResp(
      splited[0], JSON.parse(splited[1]), JSON.parse(splited[2]));
}
function HTTPConn(conn) {
  'use strict';
  this._connection = conn;
  var buffer = '';
  this._connection.onmessage = (ev) => {
    'use strict';
    if (ev.type == 'Output') {
      buffer += ev.data;
      try {
        if (this._pendingReq.length != 0) {
          this._pendingReq[0][1](RespFromStr(buffer));
          this._pendingReq.shift();
          buffer = '';
        }
        if (this._pendingReq.length != 0)
          this._connection.send(this._pendingReq[0][0]);
      } catch (r) {
      }
    }
  };
  this._pendingReq = [];
  this.close = () => this._connection.close();
  this.access = (req, callback) => {
    'use strict';
    if (this._pendingReq.length == 0)
      this._connection.send(req.toString() + '\n');
    this._pendingReq.push([req, callback]);
  }
}