import { Follow } from '@/modules/users/entities';

export class FollowResponse {
    public id: number;

    public follower: { id: number; nickname: string; image: string };

    public following: { id: number; nickname: string; image: string };

    constructor(record: Follow) {
        this.id = record.id;
        this.follower = record.follower;
        this.following = record.following;
    }
}
