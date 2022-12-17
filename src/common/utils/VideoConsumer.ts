import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as fs from 'fs';
import { jobParams } from '@/common/utils/VideoProducer';
import { FileStorage } from '@/common/utils/FileStorage';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffmpeg = require('fluent-ffmpeg');

@Processor('video')
export class VideoConsumer {
    constructor(private readonly fileStorage: FileStorage) {}

    @OnQueueActive()
    onActive(job: Job) {
        console.log(`[BULL] Processing job ${job.id} with data ${JSON.stringify(job.data)}`);
    }

    @OnQueueCompleted()
    onComplete(job: Job) {
        console.log(`[BULL] Job ${job.id} has completed.`);
    }

    @OnQueueFailed()
    onFailed(err: Error) {
        console.log('[BULL] An error occurred', err);
    }

    @Process()
    async processVideo(job: Job<jobParams>) {
        const { localPath, thumbnailKey, videoKey } = job.data;

        new Promise((resolve, reject) => {
            ffmpeg(`${localPath}/${videoKey}`)
                .on('end', async () => {
                    console.log('Video processing finished');
                    const videoBuffer = fs.readFileSync(`${localPath}/${videoKey}-processed`);

                    await this.fileStorage.upload(
                        'videos',
                        { buffer: videoBuffer, mimetype: 'video/mp4' },
                        videoKey,
                    );

                    ffmpeg(`${localPath}/${videoKey}`)
                        .on('end', () => {
                            console.log('Thumbnail extraction finished');
                            const thumbnailBuffer = fs.readFileSync(
                                `${localPath}/${thumbnailKey}.png`,
                            );

                            this.fileStorage
                                .upload(
                                    'thumbnails',
                                    { buffer: thumbnailBuffer, mimetype: 'image/png' },
                                    thumbnailKey,
                                )
                                .then(() => {
                                    fs.rm(
                                        `${localPath}`,
                                        { recursive: true, force: true },
                                        (err) => err && console.error(err),
                                    );
                                    resolve(null);
                                });
                        })
                        .on('error', (err) => {
                            console.error(err);
                            reject(err);
                        })
                        .screenshot({
                            timestamps: [0.1],
                            filename: thumbnailKey,
                            folder: localPath,
                        });
                })
                .on('error', (err) => {
                    console.error(err);
                    reject(err);
                })
                .withOutputFormat('mp4')
                .videoCodec('libx264')
                .outputOption(['-c:a copy', '-crf 18'])
                .output(`${localPath}/${videoKey}-processed`)
                .run();
        })
            .then()
            .catch();
    }

    private promisify(func: Function) {
        return new Promise((resolve) => {
            const result = func();
            resolve(result);
        });
    }
}
