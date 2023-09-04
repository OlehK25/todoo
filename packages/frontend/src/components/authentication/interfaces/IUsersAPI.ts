export interface IUsersAPI {
  id?: number;
  name?: string;
  email: string;
  password: string;
  created_at?: Date;
  role?: string;
}
