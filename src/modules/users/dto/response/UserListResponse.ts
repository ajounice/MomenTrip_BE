import { UserResponse } from '@/modules/users/dto/response/UserResponse';
import { User } from '@/modules/users/entities';

export class UserListResponse {
    list: UserResponse[];

    constructor(list: User[]) {
        this.list = list.map((user) => new UserResponse(user));
    }
}
