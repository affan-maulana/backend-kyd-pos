import { Page } from '../model/page';

const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 10;
export class MetaPaginationDto {
  totalItems: number;
  limit: number;
  totalPages: number;
  page: number;
  constructor(partial: Partial<MetaPaginationDto>) {
    Object.assign(this, partial);
  }
}

// flexible implementation
export class ResponsePaginationDto<T> {
  message?: string;
  data: T[];
  meta: MetaPaginationDto;

  constructor(data: T[], meta: Partial<MetaPaginationDto>, message?: string);
  constructor(partial: Partial<ResponsePaginationDto<T>>);
  constructor(
    dataOrPartial: T[] | Partial<ResponsePaginationDto<T>>,
    meta?: Partial<MetaPaginationDto>,
    message?: string,
  ) {
    if (Array.isArray(dataOrPartial)) {
      // Called with: new ResponsePaginationDto(data, meta, message)
      this.data = dataOrPartial;
      this.meta = {
        totalItems: meta?.totalItems ?? 0,
        limit: meta?.limit ?? DEFAULT_SIZE,
        page: meta?.page ?? DEFAULT_PAGE,
        totalPages: Math.ceil(
          (meta?.totalItems ?? 0) / (meta?.limit ?? DEFAULT_SIZE),
        ),
      };
      this.message = message ?? 'Data retrieved successfully';
    } else {
      // Called with: new ResponsePaginationDto({ ... })
      Object.assign(this, dataOrPartial);
    }
  }

  static fromPage<E, T>(
    page: Page<E>,
    transformer: (i: E) => T,
    message?: string,
  ): ResponsePaginationDto<T> {
    return new ResponsePaginationDto({
      message: message ?? 'Data retrieved successfully',
      data: page.data.map((item) => transformer(item)),
      meta: new MetaPaginationDto({
        totalItems: +page.totalItems,
        limit: page.limit(),
        totalPages: page.totalPages(),
        page: page.page(),
      }),
    });
  }
}

// To Do: delete later if not needed
// method 1 (new implementation)
// export class ResponsePaginationDto<T> {
//   message?: string;
//   data: T[];
//   meta: MetaPaginationDto;

//   constructor(partial: Partial<ResponsePaginationDto<T>>) {
//     Object.assign(this, partial);
//   }

//   static fromPage<E, T>(page: Page<E>, transformer: (i: E) => T, message?: string): ResponsePaginationDto<T> {
//     const result = new ResponsePaginationDto({
//       message: message ?? 'Data retrieved successfully',
//       data: page.data.map(item => transformer(item)),
//       meta: new MetaPaginationDto({
//         totalItems: +page.totalItems,
//         limit: page.limit(),
//         totalPages: page.totalPages(),
//         page: page.page()
//       })
//     })
//     return result;
//   }
// }

// To Do: delete later if not needed
// method 2 (initial implementation by affan)
// export class ResponsePaginationDto<T> {
//   message?: string;
//   data: T[];
//   meta: MetaPaginationDto;

//   constructor(data: T[], meta: Partial<MetaPaginationDto>, message?: string) {
//     this.message = message ?? 'Data retrieved successfully';
//     this.data = data;
//     this.meta = {
//       totalItems: meta.totalItems ?? 0,
//       limit: meta.limit ?? DEFAULT_SIZE,
//       page: meta.page ?? DEFAULT_PAGE,
//       totalPages: Math.ceil(meta.totalItems / meta.limit),
//     };
//   }
// }
