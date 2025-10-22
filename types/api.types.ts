export interface WrapperResponse<T> {
  status: string;
  message: string;
  meta: {
    requestId: string;
    timestamp: string;
    apiVersion: string;
    durationMs: number;
  };
  data: T;
}

export type UnwrappedResponse<T> = T;
