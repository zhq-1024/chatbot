const txtLoginIdValidator = new FieldValidator("txtLoginId",(inputValue)=>{
    if(!inputValue) return `请输入账号！`;
})
const txtLoginPwdValidator = new FieldValidator("txtLoginPwd",(inputValue)=>{
    if(!inputValue) return `请输入密码！`;
})
const loginBtn = document.querySelector(".submit");
loginBtn.addEventListener("click",async (e)=>{
    e.preventDefault();//阻止事件的默认行为
    const validateResult = await FieldValidator.validateForm(txtLoginIdValidator,txtLoginPwdValidator);
    if(!validateResult) return;
    const data = Object.fromEntries(new FormData(document.querySelector(".user-form")));
    const resp = await api.login(data);
    console.log(resp);
    if(resp.code === 0){
        location.href = './index.html';
    }else{
        txtLoginIdValidator.p.innerText = "账号或密码错误!";
        txtLoginPwdValidator.input.innerText = "";
    }
})