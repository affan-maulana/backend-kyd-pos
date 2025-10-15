import { PageUtil } from '@common/page.util';
import { ApiProperty } from '@nestjs/swagger';

export class Page<T> {
  @ApiProperty()
  private pageUtil: PageUtil;
  @ApiProperty()
  data: T[];
  @ApiProperty()
  totalItems: number;
  @ApiProperty()
  totalPages = () => {
    return Math.ceil(this.totalItems / this.pageUtil.limit);
  };
  page = () => {
    return this.pageUtil.page;
  };
  limit = () => {
    return this.pageUtil.limit;
  };
  constructor(data: T[], total: number, pageUtil: PageUtil) {
    this.data = data;
    this.totalItems = total;
    this.pageUtil = pageUtil;
  }
}
