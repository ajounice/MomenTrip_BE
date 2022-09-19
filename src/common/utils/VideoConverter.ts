import { Injectable } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffmpeg = require('fluent-ffmpeg');

@Injectable()
export class VideoConverter {
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

    convertToH264(tmpPath: string, video: Express.Multer.File): Promise<string> {
        if (!video.mimetype.includes('video')) {
            console.log('Video file required');
            return;
        }

        const name = `tmp-convert-${+new Date()}.mp4`;

        return new Promise((resolve, reject) => {
            ffmpeg(tmpPath)
                .on('end', () => {
                    console.log('Convert finished');
                    resolve(`./tmp/${name}`);
                })
                .on('error', (err) => {
                    reject(err);
                })
                .withOutputFormat('mp4')
                .videoCodec('libx264')
                .outputOption(['-c:a copy', '-crf 18'])
                .output(`./tmp/${name}`)
                .run();
        });
    }
}
