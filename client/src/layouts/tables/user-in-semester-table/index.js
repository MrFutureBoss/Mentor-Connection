// @mui material components
import Card from "@mui/material/Card";
import { Grid, AppBar, Tab, Tabs } from "@mui/material";
import MKBox from "components/MKBox";
import { setRole } from "app/slices/userSlice";
import usersTableData from "layouts/tables/user-in-semester-table/data/tableData";
import DataTable from "Tables/DataTable";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "pagination";

function Tables() {
  const dispatch = useDispatch();
  const { columns, rows } = usersTableData();
  const { total } = useSelector((state) => state.semester.usersInSmt);
  const { pageNo, limit } = useSelector((state) => state.utilities);
  const { role } = useSelector((state) => state.user);
  let qttPage = total && total > 0 ? Math.ceil(total / limit) : 0;
  const handleTabType = (event, newValue) => dispatch(setRole(newValue));
  return (
    <MKBox width={"100%"} height={"100%"}>
      <Grid container spacing={6} width={"100%"} height={"100%"} m={0}>
        <Grid item xs={12} height={"100%"} p={0} sx={{ padding: "0 !important" }}>
          <Card
            id={"card-table-user"}
            sx={{
              boxShadow: "none",
              height: "100%",
              margin: "auto 0",
            }}
          >
            <MKBox px={3}>
              <Grid item xs={6}>
                <AppBar position="static">
                  <Tabs value={role} onChange={handleTabType}>
                    <Tab
                      icon={
                        <MKBox
                          component="i"
                          color="dark"
                          mr={1.25}
                          sx={{ fontSize: ({ typography: { size } }) => size.sm }}
                          className="fas fa-desktop"
                        />
                      }
                      value={4}
                      label="Học sinh"
                    />
                    <Tab
                      icon={
                        <MKBox
                          component="i"
                          color="dark"
                          mr={1.25}
                          sx={{ fontSize: ({ typography: { size } }) => size.sm }}
                          className="fas fa-code"
                        />
                      }
                      value={2}
                      label="Giáo viên"
                    />
                    <Tab
                      icon={
                        <MKBox
                          component="i"
                          color="dark"
                          mr={1.25}
                          sx={{ fontSize: ({ typography: { size } }) => size.sm }}
                          className="fas fa-code"
                        />
                      }
                      value={3}
                      label="Người hướng dẫn"
                    />
                  </Tabs>
                </AppBar>
              </Grid>
            </MKBox>
            <MKBox height={"100%"}>
              <DataTable table={{ columns, rows }} />
            </MKBox>
            {qttPage > 1 && limit > 0 && <Pagination pageNo={pageNo} qttPage={qttPage} />}
          </Card>
        </Grid>
      </Grid>
    </MKBox>
  );
}

export default Tables;
