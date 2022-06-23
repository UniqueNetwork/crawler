import { Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';

@Injectable()
export class Utils {
  static async wait(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  static getAmountValue(strNum: string) {
    BigNumber.config({
      EXPONENTIAL_AT: [-30, 30],
    });

    const result = new BigNumber(strNum);
    const dividedBy = result.dividedBy('1000000000000000000').toString();
    return dividedBy;
  }
}
