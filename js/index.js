(async () => {
  //验证用户是否登录
  const resp = await api.validateUserIsLogin();
  const user = resp.data;
  if (!user) {
    location.href = "./login.html";
    return;
  }
  //下面的代码一定是登陆环境
  const doms = {
    aside: {
      nickname: document.querySelector("#nickname"),
      loginId: document.querySelector("#loginId"),
    },
    close: document.querySelector(".close"),
    chatContainer: document.querySelector(".chat-container"),
    txtMsg: document.querySelector("#txtMsg"),
    msgContainer: document.querySelector(".msg-container"),
  };
  const setUserInfo = () => {
    doms.aside.nickname.innerText = user.nickname;
    doms.aside.loginId.innerText = user.loginId;
  };
  //处理时间
  const dateFormat = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth()+1).toString().padStart(2,'0');
    const day = date.getDay().toString().padStart(2,'0');
    const hours = date.getHours().toString().padStart(2,'0');
    const minute = date.getMinutes().toString().padStart(2,'0');
    const second = date.getSeconds().toString().padStart(2,'0');
    return `${year}-${month}-${day} ${hours}:${minute}:${second}`;
  };
  //添加一条聊天记录
  const addChat = (chatInfo) => {
    const div = document.createElement("div");
    div.classList.add("chat-item");
    const img = document.createElement("img");
    img.classList.add("chat-avatar");
    const div1 = document.createElement("div");
    div1.classList.add("chat-content");
    div1.innerText = chatInfo.content;
    const div2 = document.createElement("div");
    div2.classList.add("chat-date");
    div2.innerText = dateFormat(chatInfo.createdAt);
    if (chatInfo.from) {
      //自己
      div.classList.add("me");
      img.src = "./asset/avatar.png";
    } else {
      //机器人
      img.src = "./asset/robot-avatar.jpg";
    }
    div.appendChild(img);
    div.appendChild(div1);
    div.appendChild(div2);
    return div;
  };
  //加载聊天记录方法
  const loadChats = async () => {
    const chatHistory = await api.getHistory();
    doms.chatContainer.innerHTML = "";
    for (let i = 0; i < chatHistory.data.length; i++) {
      doms.chatContainer.appendChild(addChat(chatHistory.data[i]));
    }
  };
  //设置滚动条 让聊天区域的滚动条滚动到底
  const scrollBottom = () => {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  };
  async function sendChat() {
    const content = doms.txtMsg.value.trim();
    if (!content) {
      return;
    }
    doms.chatContainer.appendChild(
      addChat({
        from: user.loginId,
        to: null,
        createdAt: Date.now(),
        content,
      })
    );
    doms.txtMsg.value = "";
    scrollBottom();
    const resp = await api.sendChat(content);
    doms.chatContainer.appendChild(
      addChat({
        from: null,
        to: user.loginId,
        ...resp.data,
      })
    );
    scrollBottom();
  }
  //设置用户信息
  setUserInfo();
  //退出功能
  doms.close.onclick = () => {
    api.loginOut();
    location.href = "./login.html";
  };
  //加载聊天记录
  await loadChats();
  scrollBottom();
  // 发送消息事件
  doms.msgContainer.onsubmit = function (e) {
    e.preventDefault();
    sendChat();
  };
})();
