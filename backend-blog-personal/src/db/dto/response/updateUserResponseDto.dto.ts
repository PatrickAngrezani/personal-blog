export class UpdateUserResponseDto {
  id: string;
  updatedAt: string;

  constructor(id: string, updatedAt: string) {
    this.id = id;
    this.updatedAt = updatedAt;
  }
}
