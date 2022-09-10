/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { main_Stats } from '../models/main_Stats';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class StatisticsService {

    /**
     * Returns statistics about the SICAs
     * Returns statistics about the SICAs, e.g., the number of tools that support Terraform
     * @returns main_Stats Statistics
     * @throws ApiError
     */
    public static getSicasStats(): CancelablePromise<main_Stats> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sicas/stats',
        });
    }

}
