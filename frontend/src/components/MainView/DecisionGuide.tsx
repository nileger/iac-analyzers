/* eslint-disable no-lone-blocks */
import * as React from "react";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { purpleBackground } from "../../utils/Colors";
import {
  iac_analyzers_SICA,
  OpenAPI,
  SicasService,
} from "../../services/openapi";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { Chip } from "@mui/material";
import { useRef } from "react";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import InfoIcon from "@mui/icons-material/Info";
import Grid from "@mui/material/Grid";

OpenAPI.BASE = "./api";

var hasSearched = false;
var isInitialStateChange = true;
const CUSTOM_IAC_TOOL = "custom IaC tool";
const CUSTOM_CHECKS = "customChecks";

/**
 * Data structure for the representation of the state of a checkbox
 */
type Option = {
  name: string;
  checked: boolean;
};

/**
 * The supported option categories a user can select
 */
enum Options {
  TOOL_SUPPORT,
  FILE_SUPPORT,
  RULE_IMPLEMENTATION,
  RULES,
}

const DecisiongGuide: React.FC = () => {
  /** Options */
  const [toolSupport, setToolSupport] = React.useState<Option[]>([]);
  const [fileSupport, setFileSupport] = React.useState<Option[]>([]);
  const [rules, setRules] = React.useState<Option[]>([]);
  const [ruleImplementation, setRuleImplementation] = React.useState<Option[]>(
    []
  );
  /** Result */
  const [sicas, setSicas] = React.useState<iac_analyzers_SICA[]>([]);

  /** Transform the options into a SICA  */
  const optionStatetoSICA = () => {
    return {
      toolSupport: [
        ...toolSupport
          .filter((t) => t.checked && CUSTOM_IAC_TOOL !== t.name)
          .map((t) => t.name),
      ],
      fileSupport: [...fileSupport.filter((f) => f.checked).map((f) => f.name)],
      rules: Object.assign(
        {},
        ...rules.filter((r) => r.checked).map((r) => ({ [r.name]: r.checked }))
      ),
      implementation: {
        ruleImplementation: [
          ...ruleImplementation.filter((r) => r.checked).map((r) => r.name),
        ],
      },
    } as iac_analyzers_SICA;
  };

  /**
   * Transforms an array of options (e.g., IaC tools) into a more suitable format for checkboxes
   * @param elements the elements
   * @see https://stackoverflow.com/a/45544166/11711692
   * @returns a list of options
   */
  const toOptions = (elements: string[]) => {
    return elements
      .sort((e1, e2) => e1.localeCompare(e2))
      .map((element: string) => {
        return {
          name: element,
          checked: false,
        };
      });
  };

  /** Retrieve supported options */
  React.useEffect(() => {
    SicasService.getSicasOptions().then((o: iac_analyzers_SICA) => {
      setToolSupport(
        toOptions([...(o.toolSupport as string[]), CUSTOM_IAC_TOOL])
      );
      setFileSupport(toOptions(o.fileSupport as string[]));
      setRules(toOptions([...Object.keys(o.rules as string[])]));
      setRuleImplementation(
        toOptions(o.implementation?.ruleImplementation as string[])
      );
      isInitialStateChange = false;
    });
    getSICAs();
  }, []);

  /** Get SICAs for the specified options */
  const getSICAs = () => {
    setIsLoading(true);
    SicasService.postSicas(optionStatetoSICA()).then(
      (s: iac_analyzers_SICA[]) => {
        hasSearched = true;
        setIsLoading(false);
        setSicas(
          s?.sort((a: iac_analyzers_SICA, b: iac_analyzers_SICA) =>
            a.name!.localeCompare(b.name!)
          )
        );
      }
    );
  };

  /** Update the state of a specific option */
  const updateOptionState = (
    s: Option[],
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    return s.map((l) => {
      if (l.name === event.target.name) {
        return {
          name: event.target.name,
          checked: event.target.checked,
        };
      } else {
        return l;
      }
    });
  };

  const updateOptionStateWithValue = (
    s: Option[],
    name: string,
    value: boolean
  ) => {
    return s.map((l) => {
      if (l.name === name) {
        return {
          name: name,
          checked: value,
        };
      } else {
        return l;
      }
    });
  };

  /** Handle checkbox change events */
  const handleChange = (
    path: Options,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    switch (path) {
      case Options.TOOL_SUPPORT: {
        setToolSupport(updateOptionState(toolSupport, event));
        // Uncheck all fileSupport checkboxes when "custom IaC tool" is unselected
        if (
          CUSTOM_IAC_TOOL === event.target.name &&
          false === event.target.checked
        ) {
          setFileSupport(
            fileSupport.map((f) => ({ name: f.name, checked: false }))
          );
        }
        break;
      }
      case Options.FILE_SUPPORT: {
        setFileSupport(updateOptionState(fileSupport, event));
        break;
      }
      case Options.RULES: {
        setRules(updateOptionState(rules, event));
        if (
          CUSTOM_CHECKS === event.target.name &&
          false === event.target.checked
        ) {
          setRuleImplementation(
            ruleImplementation.map((r) => ({ name: r.name, checked: false }))
          );
        }
        break;
      }
      case Options.RULE_IMPLEMENTATION: {
        setRuleImplementation(updateOptionState(ruleImplementation, event));
        break;
      }
    }
  };

  const isFirstRender = useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current || isInitialStateChange) {
      isFirstRender.current = false;
      return;
    }
    getSICAs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolSupport, fileSupport, rules, ruleImplementation]);

  /** Create a form control */
  const createFormControl = (
    label: string,
    path: Options,
    options: Option[]
  ) => (
    <FormControl sx={{ marginTop: 2 }} component="fieldset" variant="standard">
      <FormLabel sx={{ color: "white" }} component="legend">
        {" "}
        {label}{" "}
      </FormLabel>
      <FormGroup>
        {options?.map((e) => {
          return (
            <FormControlLabel
              control={
                <Checkbox
                  sx={{ color: "white" }}
                  onChange={(e) => handleChange(path, e)}
                  checked={e.checked}
                  name={e.name}
                  key={e.name}
                />
              }
              sx={{ color: "white" }}
              label={e.name}
            />
          );
        })}
      </FormGroup>
    </FormControl>
  );

  const removeAllFilters = () => {
    setToolSupport(toolSupport.map((t) => ({ name: t.name, checked: false })));
    setFileSupport(fileSupport.map((f) => ({ name: f.name, checked: false })));
    setRules(rules.map((r) => ({ name: r.name, checked: false })));
    setRuleImplementation(
      ruleImplementation.map((r) => ({ name: r.name, checked: false }))
    );
  };

  const atLeastTwoFiltersActive = () => {
    return (
      [...toolSupport, ...fileSupport, ...rules, ...ruleImplementation]?.filter(
        (i) => i.checked
      )?.length >= 2
    );
  };

  const removeFilter = (name: string, path: Options) => {
    switch (path) {
      case Options.TOOL_SUPPORT: {
        setToolSupport(updateOptionStateWithValue(toolSupport, name, false));
        if (CUSTOM_IAC_TOOL === name) {
          setFileSupport(
            fileSupport.map((f) => ({ name: f.name, checked: false }))
          );
        }
        break;
      }
      case Options.FILE_SUPPORT: {
        setFileSupport(updateOptionStateWithValue(fileSupport, name, false));
        break;
      }
      case Options.RULES: {
        setRules(updateOptionStateWithValue(rules, name, false));
        if (CUSTOM_CHECKS === name) {
          setRuleImplementation(
            ruleImplementation.map((r) => ({ name: r.name, checked: false }))
          );
        }
        break;
      }
      case Options.RULE_IMPLEMENTATION: {
        setRuleImplementation(
          updateOptionStateWithValue(ruleImplementation, name, false)
        );
        break;
      }
    }
  };

  /** State and Handling of Accordions */
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const handleExpandChange =
    (panel: string | undefined) =>
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(panel && isExpanded ? panel : false);
    };

  /** Loading */
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  /** Filter Popup Button */
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Box
        sx={{
          display: "inline-block",
          color: "white",
          width: "20%",
          margin: "1em",
          verticalAlign: "top",
          border: "white",
        }}
      >
        <div>
          <Typography variant="h4" component="h4">
            Filter
          </Typography>
          {/* Filter Popup Button */}
          <Button
            aria-describedby={id}
            variant="text"
            onClick={handleClick}
            size="small"
            startIcon={<InfoIcon />}
          >
            More information
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Typography sx={{ p: 2 }} variant="body1">
              Selecting multiple filters means searching for tools that have all
              these characteristics.
            </Typography>
            <Typography sx={{ p: 2 }}>
              <b>builtInChecks:</b> Does the tool come with pre-configured
              rules? <br></br>
              <b>customChecks:</b> Does the tool allow you to write your own
              rules? <br></br>
              <b>blacklistChecks:</b> Does the tool allow you to disable certain
              checks? <br></br>
              <b>whitelistChecks:</b> Does the tool allow you to run only checks
              you specifically select? <br></br>
              <b>ignoreFindings:</b> Does the tool allow you to ignore findings,
              e.g., by adding a comment to the particular line? <br></br>
            </Typography>
          </Popover>
        </div>
        <>
          <Grid container>
            <Grid container item sm={12} lg={12}>
              <Grid container item sm={12} lg={6}>
                {createFormControl(
                  "Tool Support",
                  Options.TOOL_SUPPORT,
                  toolSupport
                )}
                {createFormControl("Rules", Options.RULES, rules)}
              </Grid>
              <Grid container item sm={12} lg={6}>
                {toolSupport?.find((t) => CUSTOM_IAC_TOOL === t.name)
                  ?.checked ? (
                  createFormControl(
                    "File Support",
                    Options.FILE_SUPPORT,
                    fileSupport
                  )
                ) : (
                  <></>
                )}
                {rules?.find((o) => "customChecks" === o.name)?.checked ? (
                  createFormControl(
                    "Rule Implementation",
                    Options.RULE_IMPLEMENTATION,
                    ruleImplementation
                  )
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>
          </Grid>
        </>
      </Box>
      <Box
        sx={{
          display: "inline-block",
          color: "white",
          margin: "1em",
          width: "70%",
          verticalAlign: "top",
        }}
      >
        <div>
          <Typography variant="h4" component="h4">
            Results
          </Typography>
        </div>
        <Box sx={{ marginTop: "1em", marginBottom: "1em" }}>
          {toolSupport
            ?.filter((t) => t.checked)
            ?.map((t) => (
              <Chip
                color="primary"
                label={t.name}
                variant="outlined"
                onDelete={(e) => removeFilter(t.name, Options.TOOL_SUPPORT)}
                sx={{ color: "white" }}
              />
            ))}
          {fileSupport
            ?.filter((f) => f.checked)
            ?.map((t) => (
              <Chip
                color="primary"
                label={t.name}
                variant="outlined"
                onDelete={(e) => removeFilter(t.name, Options.FILE_SUPPORT)}
                sx={{ color: "white" }}
              />
            ))}
          {rules
            ?.filter((r) => r.checked)
            ?.map((t) => (
              <Chip
                color="primary"
                label={t.name}
                variant="outlined"
                onDelete={(e) => removeFilter(t.name, Options.RULES)}
                sx={{ color: "white" }}
              />
            ))}
          {ruleImplementation
            ?.filter((r) => r.checked)
            ?.map((t) => (
              <Chip
                color="primary"
                label={t.name}
                variant="outlined"
                onDelete={(e) =>
                  removeFilter(t.name, Options.RULE_IMPLEMENTATION)
                }
                sx={{ color: "white" }}
              />
            ))}
          {atLeastTwoFiltersActive() ? (
            <Chip
              color="primary"
              label="Remove all"
              variant="outlined"
              onClick={removeAllFilters}
              onDelete={removeAllFilters}
              sx={{ color: "white" }}
            />
          ) : (
            <></>
          )}
        </Box>
        {isLoading ? (
          <Stack spacing={1}>
            {Array.apply(0, Array(5)).map(function (x, i) {
              return (
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={48}
                  sx={{ backgroundColor: purpleBackground }}
                />
              );
            })}
          </Stack>
        ) : (
          <div>
            {sicas?.length ? (
              sicas?.map((sica, index) => (
                <Accordion
                  TransitionProps={{ unmountOnExit: true }}
                  expanded={expanded === sica.name}
                  onChange={handleExpandChange(sica?.name)}
                  sx={{ backgroundColor: purpleBackground, color: "white" }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon htmlColor="white" />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    sx={{ ".MuiAccordionSummary-content": { margin: 0 } }}
                  >
                    <Typography sx={{ width: "33%", flexShrink: 0 }}>
                      {sica?.name}
                    </Typography>
                    <Typography>
                      {sica?.toolSupport?.length ? (
                        <>
                          {sica?.toolSupport?.map((t) => (
                            <Chip
                              color="primary"
                              label={t}
                              variant="filled"
                              sx={{ marginRight: "2px", marginBottom: "2px" }}
                            />
                          ))}
                        </>
                      ) : (
                        <></>
                      )}
                      {sica?.fileSupport?.length ? (
                        <>
                          {sica?.fileSupport?.map((f) => (
                            <Chip
                              color="primary"
                              label={f}
                              variant="filled"
                              sx={{ marginRight: "2px", marginBottom: "2px" }}
                            />
                          ))}
                        </>
                      ) : (
                        <></>
                      )}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{ alignItems: "center", justifyContent: "center" }}
                  >
                    {sica?.builtIn ? (
                      <>
                        <Typography>
                          This tool is a built-in tool and comes with the
                          particular IaC tool. Hence, not third-party tool must
                          be installed.
                        </Typography>
                        <br></br>
                      </>
                    ) : (
                      <></>
                    )}

                    {/** Tool Support */}
                    <Divider
                      sx={{
                        "&::before, &::after": {
                          borderColor: "primary.light",
                        },
                      }}
                    >
                      <Chip
                        label="Tool Support"
                        color="primary"
                        sx={{ color: "white" }}
                      />
                    </Divider>
                    {sica?.toolSupport?.length ? (
                      <ul>
                        {sica?.toolSupport?.map((t) => (
                          <li>{t}</li>
                        ))}
                      </ul>
                    ) : (
                      <> This tool doesn't support any specific IaC tools.</>
                    )}

                    {/** File Support */}
                    <Divider
                      sx={{
                        "&::before, &::after": {
                          borderColor: "primary.light",
                        },
                      }}
                    >
                      <Chip
                        label="File Support"
                        color="primary"
                        sx={{ color: "white" }}
                      />
                    </Divider>
                    {sica?.fileSupport?.length ? (
                      <>
                        <ul>
                          {sica?.fileSupport?.map((f) => (
                            <li>{f}</li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <Typography>
                        This tool doesn't support any specific file types.
                      </Typography>
                    )}

                    {/** Development Support */}
                    <Divider
                      sx={{
                        "&::before, &::after": {
                          borderColor: "primary.light",
                        },
                      }}
                    >
                      <Chip
                        label="Development Support"
                        color="primary"
                        sx={{ color: "white" }}
                      />
                    </Divider>
                    <>
                      <Typography variant="h6" component="h3">
                        CI Platform Support
                      </Typography>
                      {sica?.developmentSupport?.ci?.length ? (
                        <ul>
                          {sica?.developmentSupport?.ci?.map((c) => (
                            <li>{c}</li>
                          ))}
                        </ul>
                      ) : (
                        <Typography>
                          The tool's documentation didn't mention specific CI
                          integrations.
                        </Typography>
                      )}
                      <Typography variant="h6" component="h4">
                        IDE Support
                      </Typography>
                      {sica?.developmentSupport?.ide?.length ? (
                        <ul>
                          {sica?.developmentSupport?.ide?.map((i) => (
                            <li>{i}</li>
                          ))}
                        </ul>
                      ) : (
                        <Typography>
                          The tool's documentation didn't mention specific IDE
                          integrations.
                        </Typography>
                      )}
                      <Typography variant="h6" component="h5">
                        VC Support
                      </Typography>
                      {sica?.developmentSupport?.vc?.length ? (
                        <ul>
                          {sica?.developmentSupport?.vc?.map((vc) => (
                            <li>{vc}</li>
                          ))}
                        </ul>
                      ) : (
                        <Typography>
                          The tool's documentation didn't metnion specific VC
                          integrations.
                        </Typography>
                      )}
                    </>

                    {/** Repository Stats */}
                    <Divider
                      sx={{
                        "&::before, &::after": {
                          borderColor: "primary.light",
                        },
                      }}
                    >
                      <Chip
                        label="Repository Statistics"
                        color="primary"
                        sx={{ color: "white" }}
                      />
                    </Divider>
                    <ul>
                      <li>
                        Stars:{" "}
                        {sica.repository?.stars ? sica.repository?.stars : "NA"}
                      </li>
                      <li>
                        Contributors:{" "}
                        {sica.repository?.contributors
                          ? sica.repository?.contributors
                          : "NA"}
                      </li>
                      <li>
                        License:{" "}
                        {sica.repository?.license
                          ? sica.repository?.license
                          : "NA"}
                      </li>
                      <li>
                        Backers*:{" "}
                        {sica.repository?.backers
                          ? sica.repository?.backers
                          : "NA"}
                      </li>
                      <li>
                        First Release:{" "}
                        {sica.release?.firstRelease
                          ? sica.release?.firstRelease
                          : "NA"}
                      </li>
                      <li>
                        Last Release:{" "}
                        {sica.release?.lastRelease
                          ? sica.release?.lastRelease
                          : "NA"}
                      </li>
                    </ul>
                    <Typography>
                      * Backers describes the main contributors and supportes of
                      a SICA. This could be a company or the community.
                    </Typography>

                    {/** Rules */}
                    <Divider
                      sx={{
                        "&::before, &::after": {
                          borderColor: "primary.light",
                        },
                      }}
                    >
                      <Chip
                        label="Rules"
                        color="primary"
                        sx={{ color: "white" }}
                      />
                    </Divider>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            sx={{ color: "white", fontWeight: "bold" }}
                            checked={sica.rules?.builtInChecks}
                            name="builtInChecks"
                            key="builtInChecks"
                            size="small"
                          />
                        }
                        sx={{ color: "white" }}
                        label={
                          <>
                            Built-in checks<sup>1</sup>
                          </>
                        }
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            sx={{ color: "white", fontWeight: "bold" }}
                            checked={sica.rules?.customChecks}
                            name="customChecks"
                            key="customChecks"
                            size="small"
                          />
                        }
                        sx={{ color: "white" }}
                        label={
                          <>
                            Custom checks<sup>2</sup>
                          </>
                        }
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            sx={{ color: "white", fontWeight: "bold" }}
                            checked={sica.rules?.blacklistChecks}
                            name="blacklistChecks"
                            key="blacklistChecks"
                            size="small"
                          />
                        }
                        sx={{ color: "white" }}
                        label={
                          <>
                            Blacklist checks<sup>3</sup>
                          </>
                        }
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            sx={{ color: "white", fontWeight: "bold" }}
                            checked={sica.rules?.whitelistChecks}
                            name="whitelistChecks"
                            key="whitelistChecks"
                            size="small"
                          />
                        }
                        sx={{ color: "white" }}
                        label={
                          <>
                            Whitelist checks<sup>4</sup>
                          </>
                        }
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            sx={{ color: "white", fontWeight: "bold" }}
                            checked={sica.rules?.ignoreFindings}
                            name="ignoreFindings"
                            key="ignoreFindings"
                            size="small"
                          />
                        }
                        sx={{ color: "white" }}
                        label={
                          <>
                            Ignore Findings<sup>5</sup>
                          </>
                        }
                      />
                    </FormGroup>
                    <Typography>
                      <sup>1</sup> Does the tool come with pre-configured rules?{" "}
                      <br></br>
                      <sup>2</sup> Does the tool allow you to write your own
                      rules? <br></br>
                      <sup>3</sup> Does the tool allow you to disable certain
                      checks? <br></br>
                      <sup>4</sup> Does the tool allow you to run only checks
                      you specifically select? <br></br>
                      <sup>5</sup> Does the tool allow you to ignore findings,
                      e.g., by adding a comment to the particular line?{" "}
                      <br></br>
                    </Typography>

                    {/** Rule Implementation */}
                    <Divider
                      sx={{
                        "&::before, &::after": {
                          borderColor: "primary.light",
                        },
                      }}
                    >
                      <Chip
                        label="Rule Implementation"
                        color="primary"
                        sx={{ color: "white" }}
                      />
                    </Divider>
                    {sica?.implementation?.ruleImplementation ? (
                      <Typography>
                        How does the tool implement its rules? This is important
                        if you want to write your own rules.
                        <ul>
                          {sica?.implementation?.ruleImplementation?.map(
                            (r) => (
                              <li>{r}</li>
                            )
                          )}
                        </ul>
                      </Typography>
                    ) : (
                      <Typography>
                        The tool's documentation didn't specify the rule
                        implementation language.
                      </Typography>
                    )}

                    {/** Usage */}
                    <Divider
                      sx={{
                        "&::before, &::after": {
                          borderColor: "primary.light",
                        },
                      }}
                    >
                      <Chip
                        label="Usage"
                        color="primary"
                        sx={{ color: "white" }}
                      />
                    </Divider>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{ color: "white", fontWeight: "bold" }}
                          checked={sica.usage?.autoFix}
                          name="autofix"
                          key="autofix"
                          size="small"
                        />
                      }
                      sx={{ color: "white" }}
                      label="Autofix (Does the tool allow you to automatically resolve findings?)"
                    />
                    <Typography variant="h6" component="h5">
                      Installation Options
                    </Typography>
                    {sica?.usage?.installation?.length ? (
                      <ul>
                        {sica?.usage?.installation?.map((i) => (
                          <li>{i}</li>
                        ))}
                      </ul>
                    ) : (
                      <Typography>
                        The tool's documentation didn't specify installation
                        methods.
                      </Typography>
                    )}
                    <Typography variant="h6" component="h5">
                      Output Options
                    </Typography>
                    {sica?.usage?.output?.length ? (
                      <ul>
                        {sica?.usage?.output?.map((o) => (
                          <li>{o}</li>
                        ))}
                      </ul>
                    ) : (
                      <Typography>
                        The tool's documentation didn't specify output formats.
                      </Typography>
                    )}

                    {/** Links */}
                    <Divider
                      sx={{
                        "&::before, &::after": {
                          borderColor: "primary.light",
                        },
                      }}
                    >
                      <Chip
                        label="Links"
                        color="primary"
                        sx={{ color: "white" }}
                      />
                    </Divider>
                    <ul>
                      {sica.repository?.url ? (
                        <li>
                          <a
                            href={sica.repository?.url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "white" }}
                          >
                            Repository
                          </a>{" "}
                        </li>
                      ) : (
                        <li>No repository link available</li>
                      )}
                      {sica.usage?.documentation?.link ? (
                        <li>
                          <a
                            href={sica.usage?.documentation?.link}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "white" }}
                          >
                            Documentation
                          </a>
                        </li>
                      ) : (
                        <li>No documentation link available.</li>
                      )}
                      {sica.usage?.webApplication ? (
                        <li>
                          <a
                            href={sica.usage?.webApplication}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "white" }}
                          >
                            WebApplication
                          </a>
                        </li>
                      ) : (
                        <li>No web application available.</li>
                      )}
                    </ul>

                    {/** Implementation */}
                    <Divider
                      sx={{
                        "&::before, &::after": {
                          borderColor: "primary.light",
                        },
                      }}
                    >
                      <Chip
                        label="Implementation"
                        color="primary"
                        sx={{ color: "white" }}
                      />
                    </Divider>
                    <Typography variant="h6" component="h5">
                      Programming Languages
                    </Typography>
                    {sica?.implementation?.languages?.length ? (
                      <Typography>
                        <ul>
                          {sica?.implementation?.languages?.map((l) => (
                            <li>{l}</li>
                          ))}
                        </ul>
                      </Typography>
                    ) : (
                      <Typography>
                        The tool's documentation didn't specify implementation
                        languages.
                      </Typography>
                    )}

                    {/** Experiments */}
                    <Divider
                      sx={{
                        "&::before, &::after": {
                          borderColor: "primary.light",
                        },
                      }}
                    >
                      <Chip
                        label="Experiments"
                        color="primary"
                        sx={{ color: "white" }}
                      />
                    </Divider>
                    {sica?.experiments?.length ? (
                      <>
                        {sica?.experiments?.map((e) => (
                          <Typography>
                            Name: {e.name} <br></br>
                            {e?.executedBy?.length ? (
                              <Typography>
                                Executed by: {e?.executedBy.join(", ")}
                              </Typography>
                            ) : (
                              <></>
                            )}
                            {e?.dateOfExperiment ? (
                              <Typography>
                                Date: {e?.dateOfExperiment}
                              </Typography>
                            ) : (
                              <></>
                            )}
                            {e?.truePositives ? (
                              <Typography>
                                True Positives: {e?.truePositives}%
                              </Typography>
                            ) : (
                              <></>
                            )}
                            {e?.falsePositives ? (
                              <Typography>
                                False Positives: {e?.falsePositives}%
                              </Typography>
                            ) : (
                              <></>
                            )}
                            {e?.speed ? (
                              <Typography>Speed: {e?.speed}s</Typography>
                            ) : (
                              <></>
                            )}
                            {e?.fixRate ? (
                              <>
                                <Typography>Fix Rate<sup>1</sup>: {e?.fixRate}%</Typography>
                                <Typography>
                                  <sup>1</sup> How many findings would the practitioners fix?{" "}
                                </Typography>
                              </>
                            ) : (
                              <></>
                            )}
                            <Divider
                              sx={{
                                bgcolor: "primary.light",
                                marginTop: "5px",
                              }}
                            />
                          </Typography>
                        ))}
                      </>
                    ) : (
                      <Typography>
                        No experiments were conducted so far.
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))
            ) : (
              <div style={{ color: "white" }}>
                {hasSearched
                  ? "Seems like you are to picky. Try to be less restrictive with the options you choose."
                  : ""}
              </div>
            )}
          </div>
        )}
      </Box>
    </div>
  );
};
export default DecisiongGuide;
