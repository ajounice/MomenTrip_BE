import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
    primitiveTypes: Array<Function> = [String, Boolean, Object, Number, Array];

    async transform(value: unknown, { metatype, data }: ArgumentMetadata): Promise<any> {
        if (!metatype) {
            return value;
        }

        if (this.isPrimitiveType(metatype) && data) {
            return this.validatePrimitive(value, metatype, data);
        }

        const object = plainToClass(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            const message: { [p: string]: string[] } = {};
            errors.forEach((error) => {
                if (error.constraints) {
                    const property = error.property;
                    message[property] = Object.keys(error.constraints);
                }
            });
            // throw new ValidationException(message);
        }
        return object;
    }

    private isPrimitiveType(metatype: Function): boolean {
        return this.primitiveTypes.includes(metatype);
    }

    private validatePrimitive(value: unknown, metatype: Function, data: string) {
        if (metatype === Number) {
            const transformed = Number(value);
            if (Number.isFinite(transformed)) {
                return transformed;
            }
            // throw new ValidationException({ [data]: 'isNumber' });
        }
        return value;
    }
}
