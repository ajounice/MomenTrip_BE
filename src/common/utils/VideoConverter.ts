import { Injectable } from '@nestjs/common';

const ffmpeg = require('fluent-ffmpeg');

@Injectable()
export class VideoConverter {
    constructor() {}

    getThumbnail(tmpPath: string, video: Express.Multer.File): Promise<string> {
        if (!video.mimetype.includes('video')) {
            console.log('Video file required.');
            return;
        }

        const name = `tmp-thumbnail-${+new Date()}.png`;

        return new Promise((resolve, reject) => {
            ffmpeg(tmpPath)
                .on('end', () => {
                    console.log('Extract thumbnail finished');
                    resolve(`./tmp/${name}`);
                })
                .on('error', (err) => {
                    reject(err);
                })
                .screenshot({
                    timestamps: [0.1],
                    filename: name,
                    folder: './tmp',
                });
        });
    }
}
