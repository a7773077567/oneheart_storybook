export interface PagingMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PageQuery {
  page: number;
  take?: number;
  order?: 'ASC' | 'DESC';
}

export interface S3UploadInfo {
  method: string;
  url: string;
  maxFileSizeInMB: number;
  fileName: string;
}
