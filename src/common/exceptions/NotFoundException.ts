import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
    constructor(objectOrError?: string | object | any, description?: string) {
        super(
            HttpException.createBody(objectOrError, description, HttpStatus.NOT_FOUND),
            HttpStatus.NOT_FOUND,
        );
    }
}
