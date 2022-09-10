/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { main_SICA } from '../models/main_SICA';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SicasService {

    /**
     * Filter the SICAs
     * Filter the SICAs according the provided requirements
     * @param message The requirements
     * @returns main_SICA IaC Analyzers
     * @throws ApiError
     */
    public static postSicas(
message: main_SICA,
): CancelablePromise<Array<main_SICA>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sicas',
            body: message,
        });
    }

    /**
     * Returns all supported options
     * Returns all supported options, e.g., all the supported IaC tools
     * @returns main_SICA Options
     * @throws ApiError
     */
    public static getSicasOptions(): CancelablePromise<main_SICA> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sicas/options',
        });
    }

}
