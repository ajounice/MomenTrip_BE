import { User } from '@/modules/users/entities';

export class UpdatePasswordResponse {
    public status: boolean;
    public user: Partial<User>;

    constructor(user: User) {
        this.status = true;
        this.user = user;
    }
}
