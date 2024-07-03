import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import DataTable from "Tables/DataTable";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "utilities/initialValue";
import { setclasses } from "app/slices/classSlice";
import { setActivePopup } from "app/slices/activeSlice";
import classesTableData from "layouts/tables/class-list-table/data/classesTableData";
import Pagination from "pagination";
import { setSearch } from "app/slices/utilitiesSlice";

function Tables() {
  const dispatch = useDispatch();
  const { columns, rows } = classesTableData();
  const { total } = useSelector((state) => state.category.categories);
  const { sort } = useSelector((state) => state.class);
  const { limit, pageNo, search } = useSelector((state) => state.utilities);
  const skip = pageNo * limit;
  const jwt = localStorage.getItem("jwt");
  const config = {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${jwt}`,
    },
  };
  let qttPage = total ? Math.ceil(total / limit) : 0;
  const getClassInfo = () =>
    axios
      .get(`${BASE_URL}/class?item=createdAt&order=${sort}&skip=${skip}&search=${search}`, config)
      .then((response) => dispatch(setclasses(response.data)))
      .catch((error) => console.log(error));
  const handleAddStudentInList = () => {
    axios
      .get(`${BASE_URL}/class/add_student_in_class`, config)
      .then(() => getClassInfo())
      .catch((error) => console.log(error));
  };
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
              <MKBox
                fontWeight="bold"
                py={1}
                width="9rem"
                px={2}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.1)",
                    borderRadius: "6px",
                    cursor: "pointer",
                  },
                  textAlign: "center",
                  "&:active": {
                    backgroundColor: "rgba(0,0,0,0.2)",
                  },
                  userSelect: "none",
                }}
                onClick={() => dispatch(setActivePopup(true))}
              >
                Tạo lớp học
              </MKBox>
              <MKBox
                fontWeight="bold"
                className="pointer"
                id={"btn_add_new_list_user"}
                py={1}
                width="9rem"
                px={2}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.1)",
                    borderRadius: "6px",
                    cursor: "pointer",
                  },
                  textAlign: "center",
                  "&:active": {
                    backgroundColor: "rgba(0,0,0,0.2)",
                  },
                  userSelect: "none",
                }}
                onClick={handleAddStudentInList}
              >
                Thêm học sinh
              </MKBox>
              <MKBox width="16rem" ml="auto">
                <MKInput
                  placeholder="Tìm tên lớp..."
                  size="small"
                  fullWidth
                  onChange={({ currentTarget }) => {
                    onSearchChange(currentTarget.value);
                  }}
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
