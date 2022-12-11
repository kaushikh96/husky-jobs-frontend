import axios from "axios";
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiList from "../lib/apiList";
import { SetPopupContext } from "../App";
import { Button, Card, Grid } from '@material-ui/core';

const PublicProfile = () => {
  const { profileId } = useParams();
  const [profileDetails, setProfileDetails] = useState("");
  const [eduDetails, setEduDetails] = useState([]);
  const setPopup = useContext(SetPopupContext);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(`${apiList.user}/${profileId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setProfileDetails(response.data);
        setEduDetails(response.data.education)
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
<h1>Candidate Profile</h1>
<Card>
<Grid container spacing={2}>
  <Grid item xs={4}>
   <b> Name:</b> 
  </Grid>
  <Grid item xs={8}>
  {profileDetails.name}
  </Grid>
  <Grid item xs={4}>
  <b> Education:</b> 
  </Grid>
  <Grid item xs={8}>
  {eduDetails.map(y=>{
    return(
      <div>
        <Grid container spacing={2}>
         <Grid item xs={2}>
          <i> University:</i> 
         </Grid>
         <Grid item xs={3}>
          {y.institutionName}
         </Grid>
        <Grid item xs={2}>
          <i> Start Year:</i> 
        </Grid>
        <Grid item xs={1}>
        {y.startYear}
        </Grid>
        <Grid item xs={2}>
        <i> End Year:</i> 
        </Grid>
        <Grid item xs={1}>
        {y.endYear}
        </Grid>
      </Grid>
      </div>
  )
  })}
  </Grid>

  <Grid item xs={4}>
  <b> Candidate Rating:</b> 
  </Grid>
  <Grid item xs={8}>
  {profileDetails.rating == -1 ? 0 : profileDetails.rating}
  </Grid>
  <Grid item xs={4}>
  <b> Profile:</b> 
  </Grid>
  <Grid item xs={8}>
  {profileDetails.profile}
  </Grid>
  <Grid item xs={4}>
  <b> Resume:</b> 
  </Grid>
  <Grid item xs={8}>
  {profileDetails.resume}
  </Grid>
  <Grid item xs={4}>
  <b> Skills:</b> 
  </Grid>
  <Grid item xs={8}>
  {profileDetails.resume}
  </Grid>

</Grid><br/>
<Button variant="contained" color="secondary">
  Back
</Button>
</Card>
    </div>
  )
};

export default PublicProfile;
