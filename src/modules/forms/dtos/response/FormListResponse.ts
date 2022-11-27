import { FormResponse } from '@/modules/forms/dtos/response/FormResponse';
import { Form } from '@/modules/forms/entities';

export class FormListResponse {
    list: FormResponse[];

    constructor(record: Form[]) {
        this.list = record.map((form) => new FormResponse(form));
    }
}
