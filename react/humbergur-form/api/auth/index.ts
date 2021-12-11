import { APPLICATION_DATA } from '../data';
import { ApplicationUser } from '../entities/user';

export class AuthApi {
  static signIn = async (params: {
    userName: string;
    password: string
  }) => {
    const accessedUser = APPLICATION_DATA.users.find((user) => (
      user.userName === params.userName
        && user.password === params.password
    ));
    return accessedUser;
  };

  static signUp = async (user: ApplicationUser) => {
    APPLICATION_DATA.users.push(user);
  };
}
