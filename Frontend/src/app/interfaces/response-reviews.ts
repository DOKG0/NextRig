import { Review } from "./review";

export interface ResponseReviews extends Record<string, any> {
    success?: boolean,
    mensaje?: string,
    id?: string | number,
    httpCode?: number,
    error?: string,
    errCode?: string | number,
    data?: Review[]
}
