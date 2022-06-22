import { Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';

@Injectable()
export class Utils {
  constructor() {
    BigNumber.config({
      EXPONENTIAL_AT: [-30, 30],
    });
  }

  async wait(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  getAmountValue(strNum: string) {
    const result = new BigNumber(strNum);
    const dividedBy = result.dividedBy('1000000000000000000').toString();
    return dividedBy;
  }
}
