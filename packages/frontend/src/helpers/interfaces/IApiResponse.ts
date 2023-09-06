export interface IApiResponse {
  status: string;
  token: string;
  data: {
    user: never;
  };
  error?: string;
}
