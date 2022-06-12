// getInfo 负责由apihost和id得到作品信息。
async function getInfo(apihost, id) {
  const r = await fetch("http://" + apihost + '/api/compilers/v2/' + id);
  const d = await r.json();
  if (d['stat'] != 1) throw Error('Failed');
  return d['data'];
}
// {
//   'stat': 1, 'status': 1, 'msg': '\u64cd\u4f5c\u6210\u529f', 'data': {
//     'id': 1,
//     'name': 'Hello World',
//     'category': 2,
//     'type': 'normal',
//     'description': '',
//     'user_id': 8510061,
//     'thumbnail': null,
//     'xml':
//         '#include <iostream>\nusing namespace std;\n\nint main()\n{\n    cout
//         << "Nice to meet you.";\n    return 0;\n}',
//     'lang': 'cpp',
//     'published': 0,
//     'published_at': '0000-00-00 00:00:00',
//     'modified_at': '0000-00-00 00:00:00',
//     'likes': 19,
//     'views': 49108,
//     'comments': 96,
//     'version': 'cpp',
//     'source': 'xes_live',
//     'original_id': 0,
//     'weight': 1,
//     'deleted_at': '',
//     'created_at': '2018-05-31 07:25:59',
//     'updated_at': '2022-05-08 21:42:45',
//     'adapter': '',
//     'hidden_code': 2,
//     'assets': {'assets': [], 'cdns': ['https://livefile.xesimg.com']},
//     'removed': 1,
//     'video': '',
//     'audio': '',
//     'unlikes': 0,
//     'code_complete': 1,
//     'source_code_views': 0,
//     'favorites': 2,
//     'tags': '',
//     'xml_path': 'ffd97c65876899fc838ff4c37636f9b7',
//     'work_type': 'xes_classwork',
//     'next_template_project_id': null,
//     'next_problem': null,
//     'problem_desc': null,
//     'code_complete_json': null,
//     'live_id': null,
//     'template_project_id': null,
//     'project_type': 'compiler'
//   }
// }