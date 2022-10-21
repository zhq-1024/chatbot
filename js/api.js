const api = (() => {
  const BASE_URL = "https://study.duyiedu.com";

  const post = (path, bodyObj) => {
    const headers = { "Content-Type": "application/json" };
    const token = localStorage.getItem("token");
    if (token) {
      headers.Authorization = `bearer ${token}`;
    }
    const config = { method: "post", headers, body: JSON.stringify(bodyObj) };
    return fetch(`${BASE_URL}${path}`, config);
  };

  const get = (path) => {
    const headers = {};
    const token = localStorage.getItem("token");
    if(token){
      headers.Authorization = `bearer ${token}`;
    }
    const config = {headers};//为什么不写method指定get请求，ajax默认为get请求
    return fetch(`${BASE_URL}${path}`,config);
  }

  //注册
  const register = async (userInfo) => {
    return await post('/api/user/reg',userInfo).then(resp=>resp.json());
  };
  //登录
  const login = async (loginInfo) => {
    const response = await post('/api/user/login',loginInfo);
    const result = await response.json();
    if(result.code === 0){
      localStorage.setItem("token",response.headers.get("authorization"));
    }
    // console.log(result);
    return result;
  };
  //验证用户是否存在
  const validateUserIsExist = async (loginId) => {
    return await get(`/api/user/exists?loginId=${loginId}`).then(resp=>resp.json());
  };
  //查看登录用户信息
  const validateUserIsLogin = async () => {
    return await get(`/api/user/profile`).then(resp=>resp.json());
  };
  //发送消息
  const sendChat = async (content) => {
    return await post(`/api/chat`,{content}).then(resp=>resp.json());
  };
  //获取聊天记录
  const getHistory = async () => {
    return await get(`/api/chat/history`).then(resp=>resp.json());
  };

  const loginOut = () =>{
    localStorage.removeItem("token");
  }
  return {
    register,
    login,
    validateUserIsExist,
    validateUserIsLogin,
    sendChat,
    getHistory,
    loginOut
  };
})();
