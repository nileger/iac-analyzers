/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { iac_analyzers_tmp_iac_analyzers_backend_Stats } from '../models/iac_analyzers_tmp_iac_analyzers_backend_Stats';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class StatisticsService {

    /**
     * Returns statistics about the SICAs
     * Returns statistics about the SICAs, e.g., the number of tools that support Terraform
     * @returns iac_analyzers_tmp_iac_analyzers_backend_Stats Statistics
     * @throws ApiError
     */
    public static getSicasStats(): CancelablePromise<iac_analyzers_tmp_iac_analyzers_backend_Stats> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sicas/stats',
        });
    }

}
