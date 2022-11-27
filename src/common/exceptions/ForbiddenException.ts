import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
    constructor(objectOrError?: string | object | any, description?: string) {
        super(
            HttpException.createBody(objectOrError, description, HttpStatus.FORBIDDEN),
            HttpStatus.FORBIDDEN,
        );
    }
}
