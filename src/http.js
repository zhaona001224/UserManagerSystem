/**
 * Created by superman on 17/2/16.
 * http配置
 */

import axios from 'axios'
import store from './store/store'
import * as types from './store/types'

const service = axios.create({
  baseURL: store.state.isUrl,  // api的base_url
  timeout: 20000  // 请求超时时间
});

export default service
