/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { iac_analyzers_tmp_iac_analyzers_backend_SICA } from '../models/iac_analyzers_tmp_iac_analyzers_backend_SICA';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SicasService {

    /**
     * Filter the SICAs
     * Filter the SICAs according the provided requirements
     * @param message The requirements
     * @returns iac_analyzers_tmp_iac_analyzers_backend_SICA IaC Analyzers
     * @throws ApiError
     */
    public static postSicas(
message: iac_analyzers_tmp_iac_analyzers_backend_SICA,
): CancelablePromise<Array<iac_analyzers_tmp_iac_analyzers_backend_SICA>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sicas',
            body: message,
        });
    }

    /**
     * Returns all supported options
     * Returns all supported options, e.g., all the supported IaC tools
     * @returns iac_analyzers_tmp_iac_analyzers_backend_SICA Options
     * @throws ApiError
     */
    public static getSicasOptions(): CancelablePromise<iac_analyzers_tmp_iac_analyzers_backend_SICA> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sicas/options',
        });
    }

}
