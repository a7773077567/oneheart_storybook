export interface LoginData {
  username: string;
  password: string;
};

export interface LoginRes {
  token: string;
};

export interface UserInfoRes {
  id: string;
  username: string;
  email: string;
};
