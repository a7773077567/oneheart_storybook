import { HttpResponse, type HttpResponseInit, type StrictResponse } from 'msw';

export function getSuccessRes() {
  return HttpResponse.json({ data: { state: 'success' } });
}

export function getErrorRes(status: number, customText?: string) {
  const errorTexts = new Map([
    [401, 'Unauthorized'],
    [403, 'Not Matched'],
    [422, 'In valid Payload'],
  ]);
  const httpOptions: HttpResponseInit = {
    status,
    statusText: customText || errorTexts.get(status),
  };
  return new HttpResponse(null, httpOptions);
}
