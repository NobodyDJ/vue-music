// 封装axios，保证axios已经安装
import axios from 'axios'

const ERR_OK = 0
const baseUrl = '/'

axios.defaults.baseURL = baseUrl

// 对get方法进行封装,每个接口返回的数据格式是不一样的
export function get(url, params) {
    return axios.get(url, {
        params
    }).then((res) => {
        const serverData = res.data
        if (serverData.code === ERR_OK) {
            return serverData.result
        }
    }).catch((err) => {
        return err
    })
}
