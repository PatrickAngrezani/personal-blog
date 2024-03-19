export class DeleteUserResponseDto {
  id: string;
  deletedAt: string;

  constructor(id: string, deletedAt: string) {
    this.id = id;
    this.deletedAt = deletedAt;
  }
}
