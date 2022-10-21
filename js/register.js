const txtLoginIdValidator = new FieldValidator(
  "txtLoginId",
  async (inputValue) => {
    if (!inputValue) return `请输入账号！`;
    const resp = await api.validateUserIsExist(inputValue);
    if (resp.data) {
      //用户已存在
      return `用户已存在！`;
    }
  }
);

const txtNicknameValidator = new FieldValidator("txtNickname", (inputValue) => {
  if (!inputValue) {
    return `请输入昵称！`;
  }
});

const txtLoginPwdValidator = new FieldValidator("txtLoginPwd", (inputValue) => {
  if (!inputValue) return `请输入密码！`;
});

const txtLoginPwdConfirmValidator = new FieldValidator(
  "txtLoginPwdConfirm",
  (inputValue) => {
    if (!inputValue) return `请再次输入密码！`;
    if (inputValue !== txtLoginPwdValidator.input.value)
      return `两次密码不一致！`;
  }
);

const registerBtn = document.querySelector(".submit");
registerBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const validateResult = await FieldValidator.validateForm(
    txtLoginIdValidator,
    txtNicknameValidator,
    txtLoginPwdValidator,
    txtLoginPwdConfirmValidator
  );
  if(!validateResult) return;
  const formData = new FormData(document.querySelector(".user-form"));
  console.log(formData);
  const data = Object.fromEntries(formData);
  console.log(data);
  const resp = await api.register(data);
  if(resp.code === 0){
    alert("注册成功，点击确认跳转至登陆页面！");
    location.href = "./login.html";
  }
});
