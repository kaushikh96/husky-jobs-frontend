import axios from "axios";
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import apiList from "../lib/apiList";
import { SetPopupContext } from "../App";
import Rating from "@material-ui/lab/Rating";
import moment from "moment";
import {
  Button,
  Card,
  Grid,
  Modal,
  makeStyles,
  Paper,
  TextField
} from "@material-ui/core";
import WorkIcon from "@material-ui/icons/Work";
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ShareIcon from '@material-ui/icons/Share';

import AccessTimeIcon from '@material-ui/icons/AccessTime';
import isAuth from "../lib/isAuth";
import { userType } from "../lib/isAuth";
import { NavigateBeforeSharp } from "@material-ui/icons";

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
      <Card style={{ padding: '30px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} >
          <b>  <span style={{ fontSize: '22px'}}>{jobDetails.title}</span>  </b> &nbsp;
             Job Id: 12345 {jobDetails.externalJobId} &nbsp;
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={1} style={{ backgroundColor: '#ECECEC',alignItems:'center' }}>
            <WorkIcon></WorkIcon>
            {jobDetails.jobType}
          </Grid>&nbsp;&nbsp;
          <Grid item xs={2} style={{ backgroundColor: '#ECECEC',verticalAlign:'middle' }}>
            <LocationOnIcon></LocationOnIcon>
            Herndon, VA, United States
          </Grid>&nbsp;&nbsp;
          <Grid item xs={1} style={{ backgroundColor: '#ECECEC',verticalAlign:'middle' }}>
            <AccessTimeIcon></AccessTimeIcon>
            {jobDetails.duration} months
          </Grid>&nbsp;&nbsp;
          <Grid item xs={1} style={jobDetails.blocked == false ? {backgroundColor: '#c5e1a5'} : {backgroundColor: '#ff8164'} }>
              {jobDetails.blocked == false ? "Open" : "Blocked"}
          </Grid>&nbsp;
          <Grid item xs={2}>
          <ShareIcon></ShareIcon>
             Share this job
          </Grid>  
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <b>Posted On:</b>&nbsp;{dateofOperation}
          </Grid>
          <Grid item xs={2}>
            <b>Apply By:</b>&nbsp;{deadLine}
          </Grid>
          <Grid item xs={8}>
            
          </Grid>
         
          
          <Grid item xs={2}>
            <b>{jobDetails.maxApplicants}</b> Applications Accepted
          </Grid>
          <Grid item xs={2}>
            <b>{jobDetails.maxPositions}</b> Vacant Positions  
          </Grid>
          <Grid item xs={8}>
           
          </Grid>
          <Grid item xs={2}>
            <b>{jobDetails.activeApplications}</b> Candidates Applied
          </Grid>
          <Grid item xs={2}>
            <b>{jobDetails.acceptedCandidates}</b> Candidates Selected  
          </Grid>
          <Grid item xs={8}>
           
          </Grid>
          <Grid item xs={2}>
            <b>Salary:</b>&nbsp;${jobDetails.salary} per annum
          </Grid>
          <Grid item xs={10}>
          <Rating value={jobDetails.rating !== -1 ? jobDetails.rating : null} readOnly />
          </Grid>
          </Grid>
          <Grid container spacing={2}>

            {jobDetails?.skillsets?.map((y) => {
              return (
                    <Grid item xs={1} style={{backgroundColor: '#ECECEC',borderRadius:'20px'}}>
                      {y}
                    </Grid>
              );
            })}
          </Grid>
          <Grid container spacing={2}>
          <Grid item xs={12}>
            <b>Job Description:</b>
          </Grid>
          <Grid item xs={6}>
            <i>{jobDetails.description}</i>
          </Grid>
          <Grid item xs={6}>
            
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
