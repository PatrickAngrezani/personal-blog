export class CreateUserResponseDto {
  email: string;
  nationalId: number;

  constructor(email: string, nationalId: number) {
    this.email = email;
    this.nationalId = nationalId;
  }
}
