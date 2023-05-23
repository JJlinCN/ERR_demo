import request from '@/utils/request';

/**
 * 分页查询用户
 */
export async function pageOrders(params) {
  const res = await request.get('/system/Purchase/page',{ params });
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
