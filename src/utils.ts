import { Injectable } from '@nestjs/common';
import { Vec } from '@polkadot/types';
import { Codec } from '@polkadot/types/types';
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

  static vecToString(rawValue: Vec<any>): string {
    let str = '';
    for (let i = 0, strLen = rawValue.length; i < strLen; i++) {
      if (rawValue[i] !== 0) {
        str += String.fromCharCode(rawValue[i]);
      } else {
        break;
      }
    }
    return str;
  }

  static stringOrJson(rawValue: Codec) {
    const humanValue = rawValue.toHuman();
    return typeof humanValue === 'string' ? humanValue : rawValue.toJSON();
  }
}
