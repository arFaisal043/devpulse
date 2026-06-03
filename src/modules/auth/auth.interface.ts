export interface SignupInterface {
  name: string;
  email: string;
  password: string;
  role: "maintainer" | "contributor";
}


export interface LoginInterface {
  email: string;
  password: string;
}