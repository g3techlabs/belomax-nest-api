export class AuthenticateUserDTO {
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  access_token: string;
}
