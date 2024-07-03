// @mui material components
import Card from "@mui/material/Card";
import { Grid } from "@mui/material";
import MKBox from "components/MKBox";
import usersTableData from "layouts/tables/users-without-smt-list-table/data/tableData";
import DataTable from "Tables/DataTable";
import { useSelector } from "react-redux";
import Pagination from "pagination";

function Tables() {
  const { columns, rows } = usersTableData();
  const { total } = useSelector((state) => state.user.userWithoutSemester);
  const { pageNo, limit } = useSelector((state) => state.utilities);
  let qttPage = total && total > 0 ? Math.ceil(total / limit) : 0;

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
