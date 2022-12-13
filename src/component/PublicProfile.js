import axios from "axios";
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import apiList, { server } from "../lib/apiList";
import { SetPopupContext } from "../App";
import { Button, Card, Grid } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import {makeStyles, Avatar} from "@material-ui/core";
const PublicProfile = () => {
  const { profileId } = useParams();
  const [profileDetails, setProfileDetails] = useState("");
  const [eduDetails, setEduDetails] = useState([]);
  const setPopup = useContext(SetPopupContext);
  const history = useHistory();
  const useStyles = makeStyles((theme) => ({
    avatar: {
      width: theme.spacing(17),
      height: theme.spacing(17),
    }
  }));

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
        setEduDetails(response.data.education);
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

  const getResume = () => {
    if (profileDetails.resume && profileDetails.resume !== "") {
      const address = `${server}${profileDetails.resume}`;
      console.log(address);
      axios(address, {
        method: "GET",
        responseType: "blob",
      })
        .then((response) => {
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        })
        .catch((error) => {
          console.log(error);
          setPopup({
            open: true,
            severity: "error",
            message: "Error",
          });
        });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "No resume found",
      });
    }
  };
  const classes = useStyles();
  return (
    <div>
      <h1>Candidate Profile</h1>
      <Card style={{padding:'30px'}}>
        <Grid container spacing={2}>
          <Grid xs = {12}>
          <Avatar
            src={`${server}${profileDetails.profile}`}
            className={classes.avatar}
          />
          </Grid>
        
          <Grid item xs={4} style={{fontSize:'22px'}}>
            <b>{profileDetails.name}</b> &nbsp;
            
          </Grid>
          <Grid item xs={8}>
            
          </Grid>
          <Grid item xs={4} style={{fontSize:'22px'}}>
          <Rating value={profileDetails.rating !== -1 ? profileDetails.rating : 0} readOnly />
            
          </Grid>
          <Grid item xs={8}>
            
          </Grid>
          
          <Grid item xs={4}>
            <b> Education</b>
          </Grid>
          <Grid item xs={4}>
            
          </Grid>
          <Grid item xs={8}>
            {eduDetails.map((y) => {
              return (
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
                    <Grid item xs={2}>
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
              );
            })}
          </Grid>
          <Grid item xs={1}>
              {profileDetails?.skillsets?.map((y) => {
              return (
                    <Grid item xs={1} style={{backgroundColor: '#ECECEC',borderRadius:'20px'}}>
                      {y}
                    </Grid>
              );
            })}
          </Grid>
        </Grid>
        <br />
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            history.goBack();
          }}
        >
          Back
        </Button>&nbsp;&nbsp;&nbsp;
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            getResume();
          }}
        >
          Download Resume
        </Button>
      </Card>
    </div>
  );
};

export default PublicProfile;
