import axios from "axios";
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiList from "../lib/apiList";
import { SetPopupContext } from "../App";
import moment from "moment";
import { Button, Card, Grid } from '@material-ui/core';

const JobProfile = () => {
  const { jobId } = useParams();
  const [jobDetails, setJobDetails] = useState("");
  const [dateofOperation, setdateofOperation] = useState("2015-03-04T00:00:00.000Z");
  const [deadLine, setDeadline] = useState("2015-03-04T00:00:00.000Z");
  const setPopup = useContext(SetPopupContext);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(`${apiList.jobs}/${jobId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setdateofOperation(moment(response.dateOfPosting).utc().format('YYYY-MM-DD'));
        setDeadline(moment(response.dateOfPosting).utc().format('YYYY-MM-DD'));
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

  return(
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
  {jobDetails.blocked == false ? 'Yes' : 'No'}
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
  </Grid><br/>
  <Grid item xs={1}>
  <Button variant="contained" color="secondary">
  Back
</Button>
  </Grid>
  <Grid item xs={2}>
<Button variant="contained" color="primary">
  Apply
</Button>
  </Grid>
</Grid>

</Card>
</div>
  ); 
};

export default JobProfile;
