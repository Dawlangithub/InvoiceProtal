import { message } from 'antd';
import axios from 'axios'

const instance = axios.create({
    // baseURL: `https://192.168.19.86:5003/api/`,
    // baseURL:    `http://192.168.26.104:8055/api/`,
    // baseURL: `http://202.92.0.77:8001/api/`,
    // baseURL: `http://pafwebapi.finosys-sbs.com/api/`,
    baseURL: `http://192.168.19.97:3100/api`,
});


instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('Token');
  
      const raw = JSON.parse(localStorage.getItem('ExpireAct') || '0');
      let expireAtSec = 0;
  
      if (raw) {
        const asNumber = Number(raw);
        if (!Number.isNaN(asNumber) && asNumber > 0) {
          // numeric: seconds or milliseconds
          expireAtSec = asNumber >= 1e12 ? Math.floor(asNumber / 1000) : asNumber;
        } else {
          // string timestamp: ISO in UTC (e.g., "2025-09-05T10:11:12Z")
          const parsedMs = Date.parse(raw); // UTC if ISO/Z present
          if (!Number.isNaN(parsedMs)) {
            expireAtSec = Math.floor(parsedMs / 1000);
          }
        }
      }
  
      const nowSecUtc = Math.floor(Date.now() / 1000); // UTC-based epoch seconds
  
      if (expireAtSec && expireAtSec < nowSecUtc) {
        localStorage.clear();
        message.error('Session Expired');
        window.location.replace('/login');
        return Promise.reject(new Error('Session expired'));
      }
  
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear()
            window.location.replace('/login')
        }
        return Promise.reject(error)
    }
)

const refreshToken = () => {
    return new Promise((resolve, reject) => {
        instance.post(`authentication/refresh-token`, {
            Token: localStorage.getItem('RefreshToken'),
        }).then(res => {
            if (res.data.Success) {
                localStorage.setItem('Token', res.data?.Data?.Token)
                resolve(res.data?.Data?.Token)
            } else {
                reject(res.data)
            }
        }).catch(err => {
            reject(err.response?.data || err)
        })
    })
}


export const Get = (endPoint: string, id?: any, params?: any) => {
    return new Promise((resolve, reject) => {
        instance.get(`${endPoint}/${id ? id : ''}`, {
            params: { ...params }
        }).then(res => {
            resolve(res?.data || res?.data)
        }).catch(err => {
            if (err.response?.status == 401) {
                if (localStorage.getItem('savedCredentials')) {
                    refreshToken()
                        .then((token: any) => {
                            instance.get(`${endPoint}/${id ? id : ''}`, {
                                params: { ...params },
                                headers: { 'Authorization': `Bearer ${token}` }
                            }).then((res) => {
                                if (res.data.success) {
                                    resolve(res.data)
                                } else {
                                    reject(res.data)
                                }
                            }).catch((error) => {
                                reject(error.response?.data || error)
                            })
                        }).catch(() => {
                            localStorage.clear();
                            window.location.href = '/login';
                            message.error('Session Expired');
                        })
                } else {
                    localStorage.clear();
                    window.location.href = '/login';
                    message.error('Session Expired');
                }
            } else {
                reject(err)
            }
        })
    })
}
export const Post = (endPoint: string, body: any, id?: any, params?: any, publicAPI?: boolean) => {
    return new Promise((resolve, reject) => {
        instance.post(`${endPoint}/${id ? id : ''}`, body, {
            params: params
        }).then(res => {
            if (res.data.Success) {
                resolve(res.data)
            } else {
                reject(res.data)
            }
        }).catch(err => {
            if (err.response?.status == 401) {
                if (!publicAPI) {
                    localStorage.clear();
                    window.location.href = '/login';
                    message.error('Session Expired');
                } else {
                    reject(err.response?.data || err)
                }
            } else {
                reject(err.response?.data || err)
            }
        })
    })
}
export const Put = (endPoint: string, body: any, id: any) => {
    return new Promise((resolve, reject) => {
        instance.put(`${endPoint}/${id ? id : ''}`, body).then(res => {
            resolve(res.data)
        }).catch(err => {
            if (err.response?.status == 401) {
                if (localStorage.getItem('savedCredentials')) {
                    refreshToken()
                        .then((token: any) => {
                            instance.put(`${endPoint}/${id ? id : ''}`, body, {
                                headers: { 'Authorization': `Bearer ${token}` }
                            }).then((res) => {
                                if (res.data.success) {
                                    resolve(res.data)
                                } else {
                                    reject(res.data)
                                }
                            }).catch((error) => {
                                reject(error.response?.data || error)
                            })
                        }).catch(() => {
                            localStorage.clear();
                            window.location.href = '/login';
                            message.error('Session Expired');
                        })
                } else {
                    localStorage.clear();
                    window.location.href = '/login';
                    message.error('Session Expired');
                }
            } else {
                reject(err)
            }
        })
    })
}
export const Patch = (endPoint: string, body: any, id: any, params?: any) => {
    return new Promise((resolve, reject) => {
        instance.patch(`${endPoint}/${id ? id : ''}`, body, { params: params }).then(res => {
            resolve(res.data)
        }).catch(err => {
            if (err.response?.status == 401) {
                if (localStorage.getItem('savedCredentials')) {
                    refreshToken()
                        .then((token: any) => {
                            instance.put(`${endPoint}/${id ? id : ''}`, body, {
                                headers: { 'Authorization': `Bearer ${token}` }
                            }).then((res) => {
                                if (res.data.success) {
                                    resolve(res.data)
                                } else {
                                    reject(res.data)
                                }
                            }).catch((error) => {
                                reject(error.response?.data || error)
                            })
                        }).catch(() => {
                            localStorage.clear();
                            window.location.href = '/login';
                            message.error('Session Expired');
                        })
                } else {
                    localStorage.clear();
                    window.location.href = '/login';
                    message.error('Session Expired');
                }
            } else {
                reject(err)
            }
        })
    })
}
export const Delete = (endPoint: string, id: any) => {
    return new Promise((resolve, reject) => {
        instance.delete(`${endPoint}/${id ? id : ''}`).then(res => {
            resolve(res.data)
        }).catch(err => {
            if (err.response?.status == 401) {
                if (localStorage.getItem('savedCredentials')) {
                    refreshToken()
                        .then((token: any) => {
                            instance.delete(`${endPoint}/${id ? id : ''}`, {
                                headers: { 'Authorization': `Bearer ${token}` }
                            }).then((res) => {
                                if (res.data.success) {
                                    resolve(res.data)
                                } else {
                                    reject(res.data)
                                }
                            }).catch((error) => {
                                reject(error.response?.data || error)
                            })
                        }).catch(() => {
                            localStorage.clear();
                            window.location.href = '/login';
                            message.error('Session Expired');
                        })
                } else {
                    localStorage.clear();
                    window.location.href = '/login';
                    message.error('Session Expired');
                }
            } else {
                reject(err)
            }
        })
    })
}




export default instance;