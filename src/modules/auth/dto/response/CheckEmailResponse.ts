export class CheckEmailResponse {
    public isDuplicated: boolean;

    constructor(isDuplicated: boolean) {
        this.isDuplicated = isDuplicated;
    }
}
