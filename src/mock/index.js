//引入mockjs
import Mock from 'mockjs'
import qs from "qs";
// 设置请求前缀
const baseUrl = 'http://localhost:8081/api'

//使用mockjs模拟数据
Mock.mock(new RegExp(`${baseUrl}/system/Purchase/page\\??(.*)`), (options) => {
  const params = qs.parse(options.url.split('?')[1]); //解析请求参数
  const page = parseInt(params.page ?? 1); //获取page参数，默认值为1,代表总页数
  const limit = parseInt(params.limit ?? 10); //获取limit参数，默认值为10

  const data = {}; //新建一个空对象，用于存储最终生成的模拟数据
  data.total = page * limit; //总记录数
  data.pageDatas = []; //生成一个空的数组，用于存储每一页的模拟数据

  for (let i = 0; i < page; i++) { //循环生成所有页的模拟数据
    const pageData = Mock.mock({
      [`pageData|${limit}`]: [{ //使用mock模板生成当前页的数据项
        "serialNumber": "index",
        "protocolNumber": function() {
          const now = new Date();
          const yearStr = String(now.getFullYear()).slice(-2);
          const monthStr = (now.getMonth() + 1).toString().padStart(2, '0');
          const dayStr = now.getDate().toString().padStart(2, '0');
          const randomNum = Mock.Random.integer(1, 1000).toString().padStart(3, '0');
          return "XY" + yearStr + monthStr + dayStr + randomNum;
        },
        "state|1":["制单", "审核中", "执行中", "停用", "已完成"],
        "startDate": "@datetime",
        "supplier": "@ctitle(6)供应商",
        "rawMaterial|1":["原材料水泥", "原材料钢材"],
        "buyTime": "@datetime",
        "orderName": "@cname",
        "orderTelNumber|11": /\d/,
        "remarks": "备注"
      }]
    }).pageData; //获取生成的当前页的数据项数组
    data.pageDatas.push(pageData); //将当前页的模拟数据项存储到pageDatas数组中
  }

  return {
    code: 0,
    data: data
  }
});


