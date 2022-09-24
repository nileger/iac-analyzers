# IaC Analyzer Decision Guide
The IaC Analyzer Decision Guide helps practitioners and researchers find static infrastructure code analyzers (SICA). It comprises SICAs for many IaC tools (e.g., Ansible, Terraform, Kubernetes, Docker).

# How to Start Developing
1. Backend: `go run .`
2. Frontend: `npm install` to install all dependencies and  `npm run start` to start the application.

Changes in the frontend will automatically show up in the browser. If you make changes to the backend, you have to restart the application. <br>

If you want to update and test the cron job which updates the GitHub statistics for each SICA, you need to set `GITHUB_USERNAME`, `GITHUB_NAME`, `GITHUB_EMAIL`, `GITHUB_API_TOKEN`, and `GITHUB_REPOSITORY` in `update.go`.

You can finde more information in the `READMEs` in the subfolders.
# Folder Structure
- backend: The Go API
- data: The YAML files for the IaC analyzers
- frontend: The React frontend
- terraform: The Terraform files for the deployment of the application
# How to Cite
Either use the information provided in the `CITATION.cff` file or one of the following. <br>
### CITATION.cff
The `CITATION.cff` has been created with the [cffinit website](https://citation-file-format.github.io/cff-initializer-javascript/#/). <br>
### RIS
```
TY  - THES
AU  - Leger, Nils
T1  - Static IaC Analysis – Bridging the Gap between Research and Practice
DA  - 2022
CY  - Bad Honnef, Germany
PB  - IU University of Applied Sciences
A3  - Köhler, André
M3  - Master's thesis
M4  - Citavi
ER  -
```
### BibTeX
```
@phdthesis{Leger.2022,
 author = {Leger, Nils},
 year = {2022},
 title = {Static IaC Analysis -- Bridging the Gap between Research and Practice},
 address = {Bad Honnef, Germany},
 school = {{IU University of Applied Sciences}},
 type = {Master's thesis}
}
```

# Origin
Initially, this repository was copied from [komodorio/validkube](https://github.com/komodorio/validkube). <br>
The colors and basic code structure of [komodorio/validkube](https://github.com/komodorio/validkube) were kept, whereas the layout and functionality were significantly adapted.