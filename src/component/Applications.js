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
import axios from "axios";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import CircularProgress from "@material-ui/core/CircularProgress";
import { FiberManualRecord, LocalAtm, Timer } from "@material-ui/icons";

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: {
    height: "inherit",
  },
  statusBlock: {
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
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  iconLabel: {
    display: "flex",
    alignItems: "center",
  },
  greyIcon: {
    color: "#595959",
    marginRight: 5,
  },
  button: {
    alignSelf: "center",
  },
}));

const ApplicationTile = (props) => {
  const classes = useStyles();
  const { application } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(application.job.rating);

  const appliedOn = new Date(application.dateOfApplication);
  const joinedOn = new Date(application.dateOfJoining);

  const fetchRating = () => {
    axios
      .get(`${apiList.rating}?id=${application.job._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setRating(response.data.rating);
        console.log(response.data);
      })
      .catch((err) => {
        // console.log(err.response);
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  const changeRating = () => {
    axios
      .put(
        apiList.rating,
        { rating: rating, jobId: application.job._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setPopup({
          open: true,
          severity: "success",
          message: "Rating updated successfully",
        });
        fetchRating();
        setOpen(false);
      })
      .catch((err) => {
        // console.log(err.response);
        console.log(err);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        fetchRating();
        setOpen(false);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const colorSet = {
    applied: "#3454D1",
    shortlisted: "#DC851F",
    accepted: "#09BC8A",
    rejected: "#D1345B",
    deleted: "#B49A67",
    cancelled: "#FF8484",
    finished: "#4EA5D9",
  };

  return (
    <Paper className={classes.jobTileOuter} elevation={3}>
      <Grid container>
        <Grid container spacing={1} direction="column">
          <Grid item>
            <Typography variant="h5" style={{ fontWeight: "bold" }}>
              {application.job.title}
            </Typography>
            <Typography
              variant="body1"
              style={{ fontWeight: "bold" }}
              color="textSecondary"
            >
              {application.job.recruiter
                ? application.job.recruiter.name
                : "Anonymous"}
            </Typography>
          </Grid>
          <Grid item>
            <div>
              <div className={classes.iconLabel}>
                <BusinessCenterIcon className={classes.greyIcon} />
                {application.job.jobType}
              </div>
            </div>
            <div>
              <div className={classes.iconLabel}>
                <LocalAtm className={classes.greyIcon} />$
                {application.job.salary} per month
              </div>
            </div>
            <div>
              <div className={classes.iconLabel}>
                <Timer className={classes.greyIcon} />
                {application.job.duration !== 0
                  ? `${application.job.duration} month`
                  : `Flexible`}
              </div>
            </div>
          </Grid>
          <Grid item style={{ marginTop: 10 }}>
            {application.job.skillsets.map((skill) => (
              <Chip label={skill} style={{ marginRight: "2px" }} />
            ))}
          </Grid>
          <Grid item>
            <div>
              <div className={classes.iconLabel}>
                <FiberManualRecord className={classes.greyIcon} /> Applied On{" "}
                {appliedOn.toLocaleDateString()}
              </div>
            </div>
            {application.status === "accepted" ||
            application.status === "finished" ? (
              <div>
                <div className={classes.iconLabel}>
                  <FiberManualRecord className={classes.greyIcon} /> Joined On{" "}
                  {joinedOn.toLocaleDateString()}
                </div>
              </div>
            ) : null}
            <div
              className={classes.statusBlock}
              style={{
                color: colorSet[application.status],
                display: "flex",
                alignItems: "center",
              }}
            >
              {" "}
              <FiberManualRecord
                style={{ color: colorSet[application.status], marginRight: 5 }}
              />
              {application.status.charAt(0).toUpperCase() +
                application.status.slice(1)}
            </div>
          </Grid>
        </Grid>
      </Grid>
      {application.status === "accepted" ||
      application.status === "finished" ? (
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => {
            fetchRating();
            setOpen(true);
          }}
        >
          Rate Job
        </Button>
      ) : null}
      <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "30%",
            alignItems: "center",
          }}
        >
          <Rating
            name="simple-controlled"
            style={{ marginBottom: "30px" }}
            value={rating === -1 ? null : rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 50px" }}
            onClick={() => changeRating()}
          >
            Submit
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
};

const Applications = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.applications, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setApplications(response.data);
      })
      .catch((err) => {
        // console.log(err.response);
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      style={{ padding: "30px", minHeight: "93vh" }}
    >
      <Grid item style={{ width: "100%" }}>
        <Typography variant="h4" align="left" style={{ fontWeight: "bold" }}>
          Applications
        </Typography>
      </Grid>
      <Grid container spacing={3}>
        {applications.length > 0 ? (
          applications.map((obj) => (
            <Grid key={obj._id} item xs={12} sm={6} md={4}>
              <ApplicationTile application={obj} />
            </Grid>
          ))
        ) : (
          <Typography
            variant="h5"
            color="textSecondary"
            style={{ width: "100%", textAlign: "center", marginTop: 200 }}
          >
            No Applications Found
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default Applications;
