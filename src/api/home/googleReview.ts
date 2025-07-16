import { api } from '@/utils/api';
import type { User } from '../user';
import type { PageQuery, PagingMeta, S3UploadInfo } from '@/types/common';
import type { ReviewState } from '../review';

// Adjust the import path as necessary

export interface ReviewListContent {
  approvedAt: null | string;
  approvedBy: null | string;
  approver: null | User;
  id: number;
  reviewScreenshotUrl: string;
  reviewDateTime: string;
  status: ReviewState;
  title: string;
  user: User;
}

export interface GoogleReview {
  userId: number;
  title: string;
  reviewScreenshot: string;
  reviewDateTime: string;
}

export async function getGoogleReviewList(params: { userId?: number } & PageQuery) {
  const { data, meta } = await api.get<ReviewListContent[], PagingMeta >('GoogleReviews', { params });
  return { data, meta };
}
export async function getAGoogleReview({ id }: { id: number }) {
  const { data } = await api.get<ReviewListContent>(`GoogleReviews/${id}`);
  return data;
}

export async function createGoogleReview(payload: GoogleReview) {
  const { data } = await api.post('GoogleReviews', payload);
  return data;
}

export async function updateGoogleReview({ id }: { id: number }, payload: GoogleReview) {
  const { data } = await api.patch<GoogleReview>(`GoogleReviews/${id}`, payload);
  return data;
}

export async function deleteGoogleReview({ id }: { id: number }) {
  const { data } = await api.delete(`GoogleReviews/${id}`);
  return data;
}

// 取得 google 評論上傳 url
export async function getGoogleUploadURL({ userId }: { userId: number }) {
  const { data } = await api.get<S3UploadInfo>(`GoogleReviews/${userId}/screenShot/write-url`);
  return data;
}
