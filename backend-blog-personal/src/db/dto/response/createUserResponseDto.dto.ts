export class CreateUserResponseDto {
  email: string;
  nationalId: string;

  constructor(email: string, nationalId: string) {
    this.email = email;
    this.nationalId = nationalId;
  }
}
