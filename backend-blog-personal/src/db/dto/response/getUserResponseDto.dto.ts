export class GetUsersResponseDto {
  firstName: string;
  lastName: string;
  email: string;
  nationalId: number;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    nationalId: number
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.nationalId = nationalId;
  }
}
