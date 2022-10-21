class FieldValidator {
  constructor(txtId, validatorFunc) {
    this.input = document.querySelector(`#${txtId}`);
    this.p = this.input.nextElementSibling;
    this.validatorFunc = validatorFunc;
    this.input.onblur = () => {
      this.validate();
    };
  }

  validate = async () => {
    const err = await this.validatorFunc(this.input.value);
    if (err) {
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = "";
      return true;
    }
  };

  static validateForm = async (...validators) => {
    const promise = validators.map((item) => item.validate());
    const results = await Promise.all(promise);
    return results.every((r) => r);
  };
}
