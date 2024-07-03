import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import DataTable from "Tables/DataTable";
import { useDispatch, useSelector } from "react-redux";
import tableData from "layouts/tables/categories-list-table/data/tableData";
import Pagination from "pagination";
import { setSearch } from "app/slices/utilitiesSlice";
import MKButton from "components/MKButton";
import { setActivePopup } from "app/slices/activeSlice";
import { setCategory } from "app/slices/categorySlice";

function Tables() {
  const dispatch = useDispatch();
  const { columns, rows } = tableData();
  const { total } = useSelector((state) => state.category.categories);
  const { limit, pageNo } = useSelector((state) => state.utilities);
  const isActivePopup = (actions) => dispatch(setActivePopup(actions));
  let qttPage = total ? Math.ceil(total / limit) : 0;
  const onSearchChange = (value) => {
    dispatch(setSearch(value));
  };
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
            <MKBox
              display="flex"
              fontSize="0.825rem"
              justifyContent="space-between"
              alignItems="center"
              p={1}
              sx={{ gap: "0.5rem" }}
            >
              <MKBox display="flex" maxWidth="50%" gap="1.5rem" zIndex="5" position="relative">
                <MKButton
                  sx={{ textTransform: "none" }}
                  onClick={() => {
                    isActivePopup({ type: "create", payload: "category" });
                    dispatch(setCategory({}));
                  }}
                >
                  Tạo Lĩnh Vực
                </MKButton>
              </MKBox>
              <MKBox width="16rem" ml="auto">
                <MKInput
                  placeholder="Tìm tên lĩnh vực..."
                  size="small"
                  fullWidth
                  onChange={({ currentTarget }) => onSearchChange(currentTarget.value)}
                />
              </MKBox>
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
