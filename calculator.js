class Calculator {
  constructor(string) {
    this.string = string
    this.operation = this.getOperation()
    this.roman = false
    this.numbers
    this.digits = {
      Z: 2000,
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1
    }
    this.result
  }

  stringValidation() {
    let pattern = /[^IVX0-9*+-\/\s]/g
    if ([...this.string.matchAll(pattern)].length > 0) {
      throw new Error("Invalid expression")
    }
    pattern = /^[\S]$/
    if (pattern.test(this.string.trim())) {
      throw new Error("Invalid expression")
    }
    pattern = /[+-\/*]/g
    if ([...this.string.matchAll(pattern)].length > 1) {
      throw new Error("Invalid expression")
    }
  }

  numValidation() {
    if (this.numbers.some(v => v < 1 || v > 10))
      throw new Error("Invalid expression")
  }

  isRoman() {
    let isRoman = /^[IVX]+$/
    let arrNums = this.string.split(/[+\-*\/]/g).map(num => num.trim())
    let r = arrNums.reduce((s, v) => s + isRoman.test(v), 0)
    if (r === 1) {
      throw new Error("Invalid expression")
    } else if (r === 2) {
      arrNums = arrNums.map(num => +this.roman2arabic(num))
      if (arrNums)
        this.roman = true
    }

    this.numbers = arrNums.map(num => +num)
    this.numValidation()
  }

  arabic2roman(num) {
    if (!/^\-?\d+$/.test(num + '')) throw new Error('Can`t convert that arabic numeric to roman: ' + num)
    if (num < 1) return '';
    let result = '';
    for (let key in this.digits)
      while (num >= this.digits[key]) {
        result += key;
        num -= this.digits[key];
      }
    return result;
  }

  roman2arabic(str) {
    return str.split('').reduce((r, v, i, arr) => {
      const [a, b, c] = [this.digits[arr[i]], this.digits[arr[i + 1]], this.digits[arr[i + 2]]]
      if (b && c && a <= b && b < c) {
        throw new Error("Invalid expression")
      }
      return b > a ? r - a : r + a
    }, 0)
  }

  getOperation() {
    return [...this.string.match(/[*\/+-]/g)][0]
  }

  getNumbers() {
    let string = this.string.split(this.operation)
    string = string.map(num => num.trim())
    const numbers = string.reduce((a, b) => ({
      a,
      b
    }))
    return numbers
  }

  checkOperation() {
    if (this.operation === '+') {
      this.addition()
    } else if (this.operation === '*') {
      this.multiplication()
    } else if (this.operation === '-') {
      this.subtraction()
    } else if (this.operation === '/') {
      this.division()
    }
  }

  resultConversion(result) {
    return String(Math.floor(result))
  }

  addition() {
    this.result = resultConversion(this.numbers[0] + this.numbers[1])
  }

  multiplication() {
    this.result = resultConversion(this.numbers[0] * this.numbers[1])
  }

  subtraction() {
    this.result = resultConversion(this.numbers[0] - this.numbers[1])
  }

  division() {
    this.result = resultConversion(this.numbers[0] / this.numbers[1])
  }

  start() {
    this.stringValidation()
    this.isRoman()
    this.checkOperation()
    if (this.roman) {
      return this.arabic2roman(this.result)
    } else {
      return this.result
    }
  }
}

const calculator = string => {
  const calculate = new Calculator(string)
  return calculate.start()
}

module.exports = calculator