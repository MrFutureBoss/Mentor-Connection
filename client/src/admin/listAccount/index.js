import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
// import MKButton from "components/MKButton";
import DefaultNavbar from "Navbars/DefaultNavbar";
import Tables from "layouts/tables/user-list-table";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "utilities/initialValue";
import AddListAccount from "./addListAccount";
import { setSearchValue, setSort, setFilterRole, setUsers, setPageNo } from "app/slices/userSlice";
import routes from "routes";
import { Autocomplete } from "@mui/material";
import MKInput from "components/MKInput";
import { setActivePopup } from "app/slices/activeSlice";
import { setLimit } from "app/slices/utilitiesSlice";
// import ExcelJS from "exceljs";
// import saveAs from "file-saver";

function ListAccount() {
  const dispatch = useDispatch();
  const { active_popup } = useSelector((state) => state.active);
  const { pageNo, limit } = useSelector((state) => state.utilities);
  const { filterRole, searchValue, sort, delUser } = useSelector((state) => state.user);
  const skip = pageNo * limit;
  console.log(limit);
  const jwt = localStorage.getItem("jwt");
  const config = {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${jwt}`,
    },
  };
  const getUser = () =>
    axios
      .get(
        `${BASE_URL}/admins/users?item=createdAt&order=${sort}&skip=${skip}&limit=${limit}&role=${filterRole}&search=${searchValue}`
      )
      .then((res) => dispatch(setUsers(res.data)))
      .catch((err) => console.log(err));
  useEffect(() => {
    getUser();
  }, [dispatch, filterRole, searchValue, sort, pageNo]);
  useEffect(() => {
    if (delUser?._id) {
      axios
        .delete(`${BASE_URL}/admins/${delUser?._id}/user`, config)
        .then(() => getUser())
        .catch((err) => console.log(err));
    }
  }, [dispatch, delUser]);

  const userType = [
    { name: "Học sinh", role: 4 },
    { name: "Người hướng dẫn", role: 3 },
    { name: "Giáo viên", role: 2 },
    { name: "Quản trị viên", role: 1 },
  ];
  // const handleExportExcel = () => {
  //   console.log("ss");
  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet("mau_thong_tin_nguoi_dung");
  //   const columnNames = [
  //     "UserName",
  //     "Email",
  //     "MemberCode",
  //     "RollNumber",
  //     "DOB",
  //     "Gender",
  //     "PhoneNumber",
  //     "MenteeCount",
  //     "Dgree",
  //   ];
  //   worksheet.addRow(columnNames);
  //   columnNames.forEach((header, index) => {
  //     const column = worksheet.getColumn(index + 1);
  //     column.eachCell((cell) => {
  //       const length = String(cell.value).length;
  //       column.width = Math.max(column.width || 0, length + 2);
  //     });
  //   });
  //   const fileName = "mau_thong_tin_nguoi_dung.xlsx";
  //   workbook.xlsx.writeBuffer().then(function (buffer) {
  //     saveAs(new Blob([buffer], { type: "application/octet-stream" }), fileName);
  //   });
  // };
  const onSearchChange = (value) => {
    dispatch(setSearchValue(value));
  };
  useEffect(() => {
    dispatch(setSearchValue(""));
    dispatch(setActivePopup(false));
    dispatch(setSort(-1));
    dispatch(setUsers({ data: [], total: 0 }));
    dispatch(setFilterRole(0));
    dispatch(setPageNo(0));
    dispatch(setLimit(10));
  }, [dispatch]);

  return (
    <MKBox display="flex" flexDirection="column" sx={{ gap: "6rem" }}>
      <DefaultNavbar routes={routes} />
      <Grid item container>
        <Grid item xs={10} mx="auto">
          <MKBox sx={{ display: "flex", alignItems: "center", height: "100%", gap: "1.5rem" }}>
            {active_popup && <AddListAccount />}
            <MKBox width="100%" height="100%" overflow="auto">
              <MKBox px={1} width="100%" mx="auto" position="relative" zIndex={2}>
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  width={"100%"}
                  m={0}
                  height="100%"
                >
                  <Grid item xs={12} width="100%" height="100%" p={0}>
                    <MKBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      p={3}
                      sx={{ gap: "0.5rem" }}
                    >
                      {/* <MKBox>
                        <MKButton onClick={handleExportExcel} sx={{ textTransform: "none" }}>
                          Tải file
                        </MKButton>
                      </MKBox>
                      <MKBox>
                        <MKButton
                          onClick={() => dispatch(setActivePopup(true))}
                          sx={{ textTransform: "none" }}
                        >
                          Tạo người dùng
                        </MKButton>
                      </MKBox> */}
                      <MKBox display="flex" alignItems="center">
                        <Autocomplete
                          disableClearable
                          options={userType}
                          getOptionLabel={(option) => option.name}
                          onChange={(e, value) => {
                            dispatch(setFilterRole(value.role));
                            dispatch(setPageNo(0));
                          }}
                          size="small"
                          isOptionEqualToValue={(option, value) => option.role === value.role}
                          sx={{ width: "12rem" }}
                          renderInput={(params) => <MKInput {...params} label="Lọc theo vai trò" />}
                        />
                      </MKBox>
                      <MKBox width="16rem" ml="auto">
                        <MKInput
                          placeholder="Search email..."
                          size="small"
                          fullWidth
                          onChange={({ currentTarget }) => {
                            onSearchChange(currentTarget.value);
                          }}
                        />
                      </MKBox>
                    </MKBox>
                    <Tables />
                  </Grid>
                </Grid>
              </MKBox>
            </MKBox>
          </MKBox>
        </Grid>
      </Grid>
    </MKBox>
  );
}

export default ListAccount;
