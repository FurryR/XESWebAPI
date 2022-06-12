conn_init(window, WebSocket, Base64);
var c = null;
function getreq() {
  var url = location.search, ret = {};
  var s = url.substring(1).split('&');
  for (var i in s)
    ret[s[i].split('=')[0]] = decodeURIComponent(s[i].split('=')[1]);
  return ret;
}
function stop() {
  if (c != null) c.close();
  c = null;
}
function start() {
  var req = getreq();
  if (req['url'] != undefined && req['path'] != undefined &&
      req['url'].startsWith('xes://') && req['dns'] != undefined) {
    // xes://121
    var actual = req['url'].substring(6);
    getInfo(req['dns'], actual).then(data => {
      document.title = data.name;
      c = new HTTPConn(new Connection(data.xml, data.lang == 'cpp'));
      c._connection.onopen = () => {
        c.access(new HTTPReq('GET', req['path'], {}, ''), (resp) => {
          (eval(resp.body))(c, document.body);
        });
      };
    });
    // temp.onopen = () => {
    //   document.getElementById('status').innerText = ('opened');
    // };
    // temp.onclose = () => {
    //   document.getElementById('status').innerText = ('closed');
    // };
  }
  else document.body.innerText = '未能加载页面，因为地址、路径或者DNS不正确。';
};
document.onclose = () => {
  stop();
};
// function restart() {
//   stop();
//   var temp = new Connection(document.getElementById('code').value, true);
//   temp.onopen = () => {
//     document.getElementById('status').innerText = ('opened');
//   };
//   temp.onclose = () => {
//     document.getElementById('status').innerText = ('closed');
//   };
//   c = new HTTPConn(temp);
// }
// function acc() {
//   if (c == null) return alert('请先启动服务器。');
//   c.access(
//       new HTTPReq('GET', document.getElementById('addr').value, {}, ''),
//       (resp) => {
//         document.getElementById('show').innerHTML = resp.body;
//       });
// }
// 200 {} "Hello World"
