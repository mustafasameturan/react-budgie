const moneyFormat = (money) => {
    return money.toLocaleString()
}

const isValidQuantityInput = (value) => {
    const re = /^[0-9\b]+$/;
    if (value === '' || re.test(value)) { 
      return true;
    }
    return false;
}

const isValidExpensePrice = (value, value2) => {
  if(value < value2){
    return true;
  }
  return false;
}

export { moneyFormat, isValidQuantityInput, isValidExpensePrice}