export type BasePaginationParams = {
  page: number;
  limit: number;
  search?: string;
  additionalQuery?: string;
  filters?: any;
  sort?: any;
};

export type BasePaginationResponse = {
  currentPage: number;
  totalPage: number;
  page: number;
  pageSize: number;
};
