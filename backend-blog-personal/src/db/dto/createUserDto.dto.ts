export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  nationalId: string;
  postLimit: number;
  blocked: boolean;
  numberOfComments: number;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    nationalId: string,
    postLimit: number,
    blocked: boolean,
    numberOfComments: number
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.nationalId = nationalId;
    this.postLimit = postLimit;
    this.blocked = blocked;
    this.numberOfComments = numberOfComments;
  }
}
