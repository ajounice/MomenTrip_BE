import { User } from '@/modules/users/entities';

export class UserResponse {
    public id: number;

    public email: string;

    public nickname: string;

    public name: string;

    public intro: string;

    public image: string;

    constructor(record: User) {
        this.id = record.id;
        this.email = record.email;
        this.nickname = record.nickname;
        this.name = record.name;
        this.intro = record.intro;
        this.image = record.image;
    }
}
