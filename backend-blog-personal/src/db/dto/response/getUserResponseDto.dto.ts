export class GetUsersResponseDto {
  firstName: string;
  lastName: string;
  email: string;
  nationalId: number;
  deletedAt: Date;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    nationalId: number,
    deletedAt: Date
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.nationalId = nationalId;
    this.deletedAt = deletedAt;
  }
}
