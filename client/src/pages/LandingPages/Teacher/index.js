import React from "react";
import MKBox from "components/MKBox";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const TeacherModel = () => {
  return (
    <MKBox height="100vh" p={3}>
      {/* Cột bên trái */}
      <Grid container spacing={3}>
        <Grid item xs={3}>
          {/* Nội dung của cột bên trái */}
          <MKBox p={3} sx={{ backgroundColor: "lightgray" }}>
            <div>Left Column Content</div>
            <div>Left Column Content</div>
            <div>Left Column Content</div>
          </MKBox>
        </Grid>

        {/* Khu vực chính */}
        <Grid item xs={9}>
          <MKBox>
            {/* Thanh TabBar */}
            <AppBar position="static">
              <Tabs>
                <Tab label="Tab 1" />
                <Tab label="Tab 2" />
                <Tab label="Tab 3" />
              </Tabs>
            </AppBar>

            {/* Phân chia thành 2 phần */}
            <Grid container spacing={3}>
              {/* Bên trái */}
              <Grid item xs={3}>
                <MKBox p={3} sx={{ backgroundColor: "lightblue" }}>
                  <div>Left Content</div>
                  <div>Left Content</div>
                  <div>Left Content</div>
                </MKBox>
              </Grid>

              {/* Phần còn lại */}
              <Grid item xs={9}>
                <MKBox p={3} sx={{ backgroundColor: "lightgreen" }}>
                  <div>Main Content</div>
                  <div>Main Content</div>
                  <div>Main Content</div>
                </MKBox>
              </Grid>
            </Grid>
          </MKBox>
        </Grid>
      </Grid>
    </MKBox>
  );
};

export default TeacherModel;
