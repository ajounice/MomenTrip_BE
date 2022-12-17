import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export interface jobParams {
    localPath: string;
    thumbnailKey: string;
    videoKey: string;
}

@Injectable()
export class VideoProducer {
    constructor(@InjectQueue('video') private videoQueue: Queue) {}

    async addJobToQueue({ localPath, thumbnailKey, videoKey }: jobParams) {
        const { id } = await this.videoQueue.add({
            localPath,
            thumbnailKey,
            videoKey,
        });

        return id;
    }
}
