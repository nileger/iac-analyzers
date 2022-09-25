/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type iac_analyzers_tmp_iac_analyzers_backend_SICA = {
    builtIn?: boolean;
    categories?: Array<string>;
    developmentSupport?: {
ci?: Array<string>;
ide?: Array<string>;
vc?: Array<string>;
};
    /**
     * Must be based on experiment with author and link
     */
    experiments?: Array<{
dateOfExperiment?: string;
executedBy?: Array<string>;
falsePositives?: number;
name?: string;
speed?: number;
truePositives?: number;
}>;
    fileSupport?: Array<string>;
    implementation?: {
languages?: Array<string>;
ruleImplementation?: Array<string>;
};
    includedTools?: Array<string>;
    name?: string;
    release?: {
firstRelease?: string;
lastRelease?: string;
};
    repository?: {
backers?: string;
contributors?: number;
license?: string;
stars?: number;
url?: string;
};
    rules?: {
blacklistChecks?: boolean;
builtInChecks?: boolean;
customChecks?: boolean;
ignoreFindings?: boolean;
whitelistChecks?: boolean;
};
    /**
     * * This field is not read from the YAML files but assigned during the filtering process
     */
    score?: number;
    toolSupport?: Array<string>;
    usage?: {
autoFix?: boolean;
documentation?: {
link?: string;
quality?: string;
};
installation?: Array<string>;
output?: Array<string>;
webApplication?: string;
};
};
