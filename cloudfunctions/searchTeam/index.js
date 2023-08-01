// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {

	try {	
		const name=event.name	//希望查找的字段名，是变量
    const db = cloud.database();
    const collection = db.collection(event.collection);

    // 构造查询条件
    const keyword = event.keyword; // 搜索栏的内容
    //const regExp = new RegExp(keyword, 'i'); // 不区分大小写
		const query = {};
		query[name] = db.RegExp({ regexp: keyword });

    // 执行查询
    const result = await collection.where(query).get();

    return result.data;
  } catch (error) {
    console.error(error);
    return error;
  }
}