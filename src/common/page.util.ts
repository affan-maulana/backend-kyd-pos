export class PageUtil {
  page: number;
  limit: number;

  constructor(page = 1, limit = 10) {
    this.page = Math.max(1, Number(page));
    this.limit = Math.max(1, Number(limit));
  }

  skipRecord(): number {
    return (this.page - 1) * this.limit;
  }
}
