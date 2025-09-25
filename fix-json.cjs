const fs = require('fs');
const path = 'i18n/locales/en.json';

// 读取文件内容
let content = fs.readFileSync(path, 'utf8');

// 移除所有尾随逗号
content = content.replace(/,(\s*[\}\]])/g, '$1');

// 确保对象之间有正确的逗号
content = content.replace(/}(\s*)\"([^\"]+)\":/g, '},$1"$2":');

// 写回文件
fs.writeFileSync(path, content);

// 验证 JSON
try {
  JSON.parse(content);
  console.log('JSON 修复成功并验证通过');
} catch (e) {
  console.log('JSON 仍有错误:', e.message);
}