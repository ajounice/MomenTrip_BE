import { User } from '@/modules/users/entities';

export class UserProfileResponse {
    public id: number;

    public email: string;

    public nickname: string;

    public name: string;

    public intro: string;

    public image: string;

    public tags: { id: number; name: string }[];

    constructor(record: User) {
        this.id = record.id;
        this.email = record.email;
        this.nickname = record.nickname;
        this.name = record.name;
        this.intro = record.intro;
        this.image = record.image;
        this.tags = record.forms
            .map((form) => form.tags)
            .reduce((acc, curr) => {
                acc.push(...curr);
                return acc;
            }, []);
    }
}
