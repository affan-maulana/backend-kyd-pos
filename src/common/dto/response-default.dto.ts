import { HttpStatus } from '@nestjs/common';

// flexible implementation
// TO DO: Once decided which implementation to use, simplify this method
export class ResponseDefaultDto<T> {
  statusCode: number;
  message?: string;
  data: T;
  errors?: string[];
  timestamp: number;

  constructor(
    input:
      | T
      | {
          statusCode?: number;
          message?: string;
          result?: T;
          errors?: string[];
        },
  ) {
    if (typeof input === 'object' && 'result' in input) {
      this.statusCode = input.statusCode ?? HttpStatus.OK;
      this.message = input.message ?? 'Data retrieved successfully';
      this.data = input.result ?? null;
      this.errors = input.errors ?? null;
    } else {
      this.statusCode = HttpStatus.OK;
      this.message = 'Data retrieved successfully';
      this.data = input as T;
    }

    this.timestamp = Date.now();
  }
}

// To Do: delete later if not needed
// existing implementation
// export class ResponseDefaultDto<T> {
//     constructor({
//         statusCode = HttpStatus.OK,
//         message = 'Data retrieved successfully',
//         result = null,
//         errors = null,
//     }) {
//         this.statusCode = statusCode;
//         this.data = result;
//         this.message = message;
//         if (errors) {
//             this.errors = errors;
//         }
//         this.timestamp = Date.now();
//     }

//     statusCode: number;
//     message?: string;
//     data: T;
//     errors?: string[];
//     timestamp: number;
// }
