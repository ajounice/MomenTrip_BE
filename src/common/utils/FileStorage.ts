import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';

@Injectable()
export class FileStorage {
    private s3;
    constructor(private readonly configService: ConfigService) {
        this.s3 = new AWS.S3({
            region: 'ap-northeast-2',
            credentials: {
                accessKeyId: configService.get<string>('AWS_ACCESS_KEY'),
                secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
            },
        });
    }

    async upload(type: string, body: Express.Multer.File): Promise<{ path: string }> {
        try {
            const key = `${type}/${v4()}`;
            const result = await this.s3
                .putObject({
                    Bucket: 'momentrip-bucket',
                    Key: key,
                    Body: body.buffer,
                    ContentType: body.mimetype,
                    ACL: 'public-read',
                })
                .promise();

            console.log(result.$response);

            const fullURL = `${this.configService.get<string>('AWS_BUCKET_URL')}${key}`;

            return { path: fullURL };
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
}
