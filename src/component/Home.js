import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
  Typography,
  Modal,
  Slider,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Checkbox,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import Pagination from "@material-ui/lab/Pagination";
import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { useHistory, useParams } from "react-router-dom";
import isAuth, { userName } from "../lib/isAuth";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import CircularProgress from "@material-ui/core/CircularProgress";
import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import { userType } from "../lib/isAuth";
import Search from "@material-ui/icons/Search";
import { FiberManualRecord, LocalAtm, Timer } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  button: {
    alignSelf: "center",
  },
  jobTileOuter: {
    padding: "30px",
    margin: "20px 0",
    boxSizing: "border-box",
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    "&:hover": {
      border: "2px solid",
      cursor: "pointer",
    },
  },
  jobTileOuterAdmin: {
    padding: "30px",
    margin: "20px 0",
    height: "100%",
    boxSizing: "border-box",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  homeTitle: {
    marginTop: 20,
    fontWeight: "bold",
    color: "#050C26",
  },
  searchDiv: {
    backgroundColor: "white",
    padding: 20,
    display: "flex",
  },
  iconLabel: {
    display: "flex",
    alignItems: "center",
  },
  greyIcon: {
    color: "#595959",
    marginRight: 5,
  },
}));

const JobTile = (props) => {
  const classes = useStyles();
  const { job } = props;
  const setPopup = useContext(SetPopupContext);

  const [open, setOpen] = useState(false);
  const [sop, setSop] = useState("");
  const history = useHistory();
  const [loggedin, setLoggedin] = useState(isAuth());

  const handleClose = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setOpen(false);
    setSop("");
  };

  const handleApply = () => {
    axios
      .post(
        `${apiList.jobs}/${job._id}/applications`,
        {
          sop: sop,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        handleClose();
      })
      .catch((err) => {
        console.log(err.response);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleClose();
      });
  };

  const deadline = new Date(job.deadline).toLocaleDateString();

  const handleJobClick = (job) => {
    history.push(`/job/${job._id}`);
  };

  return (
    <Paper
      className={classes.jobTileOuter}
      elevation={3}
      onClick={() => handleJobClick(job)}
    >
      <Grid container>
        <Grid container item spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5" style={{ fontWeight: "bold" }}>
              {job.title}
            </Typography>
            <Typography
              variant="body1"
              style={{ fontWeight: "bold" }}
              color="textSecondary"
            >
              {job.recruiter ? job.recruiter.name : "Anonymous"}
            </Typography>
          </Grid>
          <Grid item>
            <Rating value={job.rating !== -1 ? job.rating : null} readOnly />
          </Grid>
          <Grid item>
            <div>
              <div className={classes.iconLabel}>
                <BusinessCenterIcon className={classes.greyIcon} />
                {job.jobType}
              </div>
            </div>
            <div>
              <div className={classes.iconLabel}>
                <LocalAtm className={classes.greyIcon} />${job.salary} per month
              </div>
            </div>
            <div>
              <div className={classes.iconLabel}>
                <Timer className={classes.greyIcon} />
                {job.duration !== 0 ? `${job.duration} month` : `Flexible`}
              </div>
            </div>
            <div>
              <div className={classes.iconLabel}>
                <FiberManualRecord className={classes.greyIcon} /> Apply by{" "}
                {deadline}
              </div>
            </div>
          </Grid>
          <Grid item style={{ marginTop: 10 }}>
            {job.skillsets.map((skill, index) => (
              <Chip key={index} label={skill} style={{ marginRight: "2px" }} />
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={(e) => {
          e.stopPropagation();
          if (!loggedin) {
            history.push("/login");
          } else {
            setOpen(true);
          }
        }}
        disabled={userType() === "recruiter"}
      >
        Apply
      </Button>
      <Modal
        open={open}
        onClose={(e) => handleClose(e)}
        className={classes.popupDialog}
      >
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "50%",
            alignItems: "center",
          }}
        >
          <TextField
            label="Write SOP (upto 250 words)"
            multiline
            rows={8}
            style={{ width: "100%", marginBottom: "30px" }}
            variant="outlined"
            value={sop}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onChange={(event) => {
              if (
                event.target.value.split(" ").filter(function (n) {
                  return n != "";
                }).length <= 250
              ) {
                setSop(event.target.value);
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 50px" }}
            onClick={(e) => {
              e.stopPropagation();
              handleApply();
            }}
          >
            Submit
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
};

const JobTileAdmin = (props) => {
  const classes = useStyles();
  const { job } = props;
  const history = useHistory();
  const [isBlocked, setIsBlocked] = useState();
  const setPopup = useContext(SetPopupContext);

  const blockJob = (jobToBlock) => {
    axios
      .put(
        `${apiList.jobs}/block/${job._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        setIsBlocked(true);
      })
      .catch((err) => {
        console.log(err.response);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
      });
  };

  return (
    <Paper className={classes.jobTileOuterAdmin} elevation={3}>
      <Grid container>
        <Grid container item spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5" style={{ fontWeight: "bold" }}>
              {job.title}
            </Typography>
            <Typography
              variant="body1"
              style={{ fontWeight: "bold" }}
              color="textSecondary"
            >
              {job.recruiter ? job.recruiter.name : "Anonymous"}
            </Typography>
          </Grid>
          <Grid item>
            <Rating value={job.rating !== -1 ? job.rating : null} readOnly />
          </Grid>
          <Grid item>
            <div>
              <div className={classes.iconLabel}>
                <BusinessCenterIcon className={classes.greyIcon} />
                {job.jobType}
              </div>
            </div>
            <div>
              <div className={classes.iconLabel}>
                <LocalAtm className={classes.greyIcon} />${job.salary} per month
              </div>
            </div>
            <div>
              <div className={classes.iconLabel}>
                <Timer className={classes.greyIcon} />
                {job.duration !== 0 ? `${job.duration} month` : `Flexible`}
              </div>
            </div>
          </Grid>
          <Grid item style={{ marginTop: 10 }}>
            {job.skillsets.map((skill, index) => (
              <Chip key={index} label={skill} style={{ marginRight: "2px" }} />
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={(e) => {
          e.stopPropagation();
          blockJob(job);
        }}
        disabled={isBlocked}
      >
        Block Job
      </Button>
    </Paper>
  );
};

const FilterPopup = (props) => {
  const classes = useStyles();
  const { open, handleClose, searchOptions, setSearchOptions, getData } = props;
  return (
    <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
      <Paper
        style={{
          padding: "50px",
          outline: "none",
          minWidth: "50%",
        }}
      >
        <Grid container direction="column" alignItems="center" spacing={3}>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Job Type
            </Grid>
            <Grid
              container
              item
              xs={9}
              justify="space-around"
              // alignItems="center"
            >
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="fullTime"
                      checked={searchOptions.jobType.fullTime}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Full Time"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="partTime"
                      checked={searchOptions.jobType.partTime}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Part Time"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="wfh"
                      checked={searchOptions.jobType.wfh}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Work From Home"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Salary
            </Grid>
            <Grid item xs={9}>
              <Slider
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => {
                  return value * (100000 / 100);
                }}
                marks={[
                  { value: 0, label: "0" },
                  { value: 100, label: "100000" },
                ]}
                value={searchOptions.salary}
                onChange={(event, value) =>
                  setSearchOptions({
                    ...searchOptions,
                    salary: value,
                  })
                }
              />
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Duration
            </Grid>
            <Grid item xs={9}>
              <TextField
                select
                label="Duration"
                variant="outlined"
                fullWidth
                value={searchOptions.duration}
                onChange={(event) =>
                  setSearchOptions({
                    ...searchOptions,
                    duration: event.target.value,
                  })
                }
              >
                <MenuItem value="0">All</MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="6">6</MenuItem>
                <MenuItem value="7">7</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Sort
            </Grid>
            <Grid item container direction="row" xs={9}>
              <Grid
                item
                container
                xs={4}
                justify="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="salary"
                    checked={searchOptions.sort.salary.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          salary: {
                            ...searchOptions.sort.salary,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="salary"
                  />
                </Grid>
                <Grid item>
                  <label for="salary">
                    <Typography>Salary</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.salary.status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          salary: {
                            ...searchOptions.sort.salary,
                            desc: !searchOptions.sort.salary.desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort.salary.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={4}
                justify="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="duration"
                    checked={searchOptions.sort.duration.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          duration: {
                            ...searchOptions.sort.duration,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="duration"
                  />
                </Grid>
                <Grid item>
                  <label for="duration">
                    <Typography>Duration</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.duration.status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          duration: {
                            ...searchOptions.sort.duration,
                            desc: !searchOptions.sort.duration.desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort.duration.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={4}
                justify="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="rating"
                    checked={searchOptions.sort.rating.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          rating: {
                            ...searchOptions.sort.rating,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="rating"
                  />
                </Grid>
                <Grid item>
                  <label for="rating">
                    <Typography>Rating</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.rating.status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          rating: {
                            ...searchOptions.sort.rating,
                            desc: !searchOptions.sort.rating.desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort.rating.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              color="primary"
              style={{ padding: "10px 50px" }}
              onClick={() => getData()}
            >
              Apply
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

const Home = (props) => {
  const [jobs, setJobs] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [loggedin, setLoggedin] = useState(isAuth());
  const { keyword } = useParams();
  const history = useHistory();
  const classes = useStyles();
  const { search } = props;
  const [loading, setLoading] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    query: keyword || "",
    jobType: {
      fullTime: false,
      partTime: false,
      wfh: false,
    },
    salary: [0, 100],
    duration: "0",
    sort: {
      salary: {
        status: false,
        desc: false,
      },
      duration: {
        status: false,
        desc: false,
      },
      rating: {
        status: false,
        desc: false,
      },
    },
  });

  const setPopup = useContext(SetPopupContext);
  useEffect(() => {
    if (userType() === "admin") {
      getAdminData();
    } else {
      getData();
    }
  }, []);

  const getAdminData = () => {
    let address = apiList.jobs;
    setLoading(true);
    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setJobs(
          response.data.filter((obj) => {
            const today = new Date();
            const deadline = new Date(obj.deadline);
            return deadline > today;
          })
        );
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
        setLoading(false);
      });
  };

  const getData = () => {
    setLoading(true);
    let searchParams = [];
    if (searchOptions.query !== "") {
      searchParams = [...searchParams, `q=${searchOptions.query}`];
    }
    if (searchOptions.jobType.fullTime) {
      searchParams = [...searchParams, `jobType=Full%20Time`];
    }
    if (searchOptions.jobType.partTime) {
      searchParams = [...searchParams, `jobType=Part%20Time`];
    }
    if (searchOptions.jobType.wfh) {
      searchParams = [...searchParams, `jobType=Work%20From%20Home`];
    }
    if (searchOptions.salary[0] != 0) {
      searchParams = [
        ...searchParams,
        `salaryMin=${searchOptions.salary[0] * 1000}`,
      ];
    }
    if (searchOptions.salary[1] != 100) {
      searchParams = [
        ...searchParams,
        `salaryMax=${searchOptions.salary[1] * 1000}`,
      ];
    }
    if (searchOptions.duration != "0") {
      searchParams = [...searchParams, `duration=${searchOptions.duration}`];
    }

    let asc = [],
      desc = [];

    Object.keys(searchOptions.sort).forEach((obj) => {
      const item = searchOptions.sort[obj];
      if (item.status) {
        if (item.desc) {
          desc = [...desc, `desc=${obj}`];
        } else {
          asc = [...asc, `asc=${obj}`];
        }
      }
    });
    searchParams = [...searchParams, ...asc, ...desc];
    const queryString = searchParams.join("&");
    let address = apiList.jobs;
    if (queryString !== "") {
      address = `${address}?${queryString}`;
    }

    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setJobs(
          response.data.filter((obj) => {
            const today = new Date();
            const deadline = new Date(obj.deadline);
            return deadline > today;
          })
        );
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
        setLoading(false);
      });
  };

  return userType() === "admin" ? (
    <>
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        style={{ padding: "30px", minHeight: "93vh" }}
      >
        <Grid
          item
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Typography variant="h5" align="left" style={{ fontWeight: "bold" }}>
            Admin
          </Typography>
        </Grid>
        <Grid container spacing={3}>
          {jobs.length > 0 ? (
            jobs.map((job) => {
              return (
                <Grid item xs={12} sm={6} md={4}>
                  <JobTileAdmin key={job._id} job={job} />
                </Grid>
              );
            })
          ) : loading ? (
            <div style={{ textAlign: "center", width: "100%" }}>
              <CircularProgress style={{ marginTop: 200 }} />
            </div>
          ) : (
            <Grid item xs={12}>
              <Typography
                variant="h5"
                color="textSecondary"
                style={{ textAlign: "center", marginTop: 200 }}
              >
                No jobs found
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  ) : (
    <>
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        style={{ padding: "30px", minHeight: "93vh" }}
      >
        <Grid
          item
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid item xs style={{ width: "100%" }}>
            {window.location.pathname?.includes("search") ? (
              <Typography
                variant="h5"
                align="left"
                style={{ fontWeight: "bold" }}
              >
                Search
              </Typography>
            ) : (
              <Typography
                variant="h5"
                align="left"
                style={{ fontWeight: "bold" }}
              >
                Welcome {userName()}
              </Typography>
            )}
          </Grid>
          <Grid item xs style={{ width: "100%" }}>
            <div className={classes.searchDiv}>
              <TextField
                label="Search Jobs"
                value={searchOptions.query}
                onChange={(event) =>
                  setSearchOptions({
                    ...searchOptions,
                    query: event.target.value,
                  })
                }
                onKeyPress={(ev) => {
                  if (ev.key === "Enter") {
                    history.push(`/search/${searchOptions.query}`);
                    getData();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <IconButton onClick={() => getData()}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                style={{ width: "100%" }}
                variant="outlined"
              />
              <IconButton onClick={() => setFilterOpen(true)}>
                <FilterListIcon />
              </IconButton>
            </div>
          </Grid>
          <Grid item xs style={{ width: "100%" }}>
            {loggedin && window.location.pathname === "/" ? (
              <Typography
                className={classes.homeTitle}
                variant="h5"
                align="left"
              >
                Based on your recent search...
              </Typography>
            ) : loggedin && window.location.pathname === "/" ? null : (
              <Typography
                className={classes.homeTitle}
                variant="h5"
                align="left"
              >
                Search results...
              </Typography>
            )}
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {jobs.length > 0 ? (
            jobs.map((job) => {
              return (
                <Grid item xs={12} sm={6} md={4}>
                  <JobTile key={job._id} job={job} />
                </Grid>
              );
            })
          ) : loading ? (
            <div style={{ textAlign: "center", width: "100%" }}>
              <CircularProgress style={{ marginTop: 200 }} />
            </div>
          ) : (
            <Grid item xs={12}>
              <Typography
                variant="h5"
                color="textSecondary"
                style={{ textAlign: "center", marginTop: 200 }}
              >
                No jobs found
              </Typography>
            </Grid>
          )}
        </Grid>
        {/* <Grid item>
          <Pagination count={10} color="primary" />
        </Grid> */}
      </Grid>
      <FilterPopup
        open={filterOpen}
        searchOptions={searchOptions}
        setSearchOptions={setSearchOptions}
        handleClose={() => setFilterOpen(false)}
        getData={() => {
          getData();
          setFilterOpen(false);
        }}
      />
    </>
  );
};

export default Home;
