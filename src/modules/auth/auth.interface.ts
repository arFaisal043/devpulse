export interface SignupInterface {
  name: string;
  email: string;
  password: string;
  role: "maintainer" | "contributor";
}