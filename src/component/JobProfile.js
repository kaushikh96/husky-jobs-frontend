import axios from "axios";
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import apiList from "../lib/apiList";
import { SetPopupContext } from "../App";
import moment from "moment";
import {
  Button,
  Card,
  Grid,
  Modal,
  makeStyles,
  Paper,
  TextField,
} from "@material-ui/core";
import isAuth from "../lib/isAuth";
import { userType } from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const JobProfile = () => {
  const classes = useStyles();
  const { jobId } = useParams();
  const [jobDetails, setJobDetails] = useState("");
  const [dateofOperation, setdateofOperation] = useState(
    "2015-03-04T00:00:00.000Z"
  );
  const [deadLine, setDeadline] = useState("2015-03-04T00:00:00.000Z");
  const setPopup = useContext(SetPopupContext);
  const [loggedin, setLoggedin] = useState(isAuth());
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [sop, setSop] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const handleApply = () => {
    axios
      .post(
        `${apiList.jobs}/${jobDetails._id}/applications`,
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

  const handleClose = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setOpen(false);
    setSop("");
  };

  const getData = () => {
    axios
      .get(`${apiList.jobs}/${jobId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setdateofOperation(
          moment(response.dateOfPosting).utc().format("YYYY-MM-DD")
        );
        setDeadline(moment(response.dateOfPosting).utc().format("YYYY-MM-DD"));
        setJobDetails(response.data);
      })
      .catch((err) => {
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  return (
    <div>
      <h1>Job Description</h1>
      <Card>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <b> Name:</b>
          </Grid>
          <Grid item xs={8}>
            {jobDetails.title}
          </Grid>
          <Grid item xs={4}>
            <b> Accepted Appplications:</b>
          </Grid>
          <Grid item xs={8}>
            {jobDetails.activeApplications}
          </Grid>
          <Grid item xs={4}>
            <b>Accepted Candidates: </b>
          </Grid>
          <Grid item xs={8}>
            {jobDetails.acceptedCandidates}
          </Grid>
          <Grid item xs={4}>
            <b>Blocked:</b>
          </Grid>
          <Grid item xs={8}>
            {jobDetails.blocked == false ? "Yes" : "No"}
          </Grid>
          <Grid item xs={4}>
            <b>Date of Posting:</b>
          </Grid>
          <Grid item xs={8}>
            {dateofOperation}
          </Grid>
          <Grid item xs={4}>
            <b>Deadline:</b>
          </Grid>
          <Grid item xs={8}>
            {deadLine}
          </Grid>
          <Grid item xs={4}>
            <b>Duration:</b>
          </Grid>
          <Grid item xs={8}>
            {jobDetails.duration}
          </Grid>
          <Grid item xs={4}>
            <b>External Job Id:</b>
          </Grid>
          <Grid item xs={8}>
            {jobDetails.externalJobId}
          </Grid>
          <Grid item xs={4}>
            <b>Job Type:</b>
          </Grid>
          <Grid item xs={8}>
            {jobDetails.jobType}
          </Grid>
          <Grid item xs={4}>
            <b>Maximum Applications:</b>
          </Grid>
          <Grid item xs={8}>
            {jobDetails.maxApplicants}
          </Grid>
          <Grid item xs={4}>
            <b>Maximum Positions: </b>
          </Grid>
          <Grid item xs={8}>
            {jobDetails.maxPositions}
          </Grid>
          <Grid item xs={4}>
            <b>Skills:</b>
          </Grid>
          <Grid item xs={8}>
            {jobDetails.maxApplicants}
          </Grid>
          <Grid item xs={4}>
            <b>Rating:</b>
          </Grid>
          <Grid item xs={8}>
            {jobDetails.rating == -1 ? 0 : jobDetails.rating}
          </Grid>
          <Grid item xs={4}>
            <b>Salary: </b>
          </Grid>
          <Grid item xs={8}>
            ${jobDetails.salary} per annum
          </Grid>
          <br />
          <Grid item xs={1}>
            <Button
              onClick={() => {
                history.goBack();
              }}
              variant="contained"
              color="secondary"
            >
              Back
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="contained"
              color="primary"
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
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default JobProfile;
