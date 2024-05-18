export interface UserInterface {
  _id?: string;
  password?: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  otp?: string;
  bio?: string;
  urls?: string[] | null

  plan?: number;
}