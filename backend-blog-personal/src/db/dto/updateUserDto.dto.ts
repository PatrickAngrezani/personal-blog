export class UpdateUserDto {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  userToken: number;
  postLimit: number;
  numberOfComments: number;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    userToken: number,
    postLimit: number,
    numberOfComments: number
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.userToken = userToken;
    this.postLimit = postLimit;
    this.numberOfComments = numberOfComments;
  }
}
