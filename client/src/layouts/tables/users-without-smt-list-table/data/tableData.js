// Material Dashboard 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import PropTypes from "prop-types";
import userImg from "assets/images/user.jpg";
import MKAvatar from "components/MKAvatar";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox } from "@mui/material";
import { setSelectUser, setSelectAll } from "app/slices/userSlice";

export default function data() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.user.userWithoutSemester);
  const { selectUser, selectAll, role } = useSelector((state) => state.user);
  const User = ({ image, name, email }) => (
    <MKBox display="flex" alignItems="center" lineHeight={1}>
      <MKAvatar src={image} name={name} size="md" />
      <MKBox ml={1} lineHeight={1}>
        <MKTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MKTypography>
        <MKTypography variant="caption">{email}</MKTypography>
      </MKBox>
    </MKBox>
  );

  const MenteeCount = ({ menteeCount }) => (
    <MKTypography component="div" variant="caption" color="text" fontWeight="medium">
      {menteeCount}
    </MKTypography>
  );
  const ClassCount = ({ classCount }) => (
    <MKTypography component="div" variant="caption" color="text" fontWeight="medium">
      {classCount}
    </MKTypography>
  );
  const Categories = ({ categories }) => (
    <MKBox lineHeight={1} textAlign="left">
      <MKTypography display="block" variant="caption" color="text">
        {categories?.map((category) => category.name)?.join(", ")}
      </MKTypography>
    </MKBox>
  );
  const Degree = ({ degree }) => (
    <MKBox lineHeight={1} textAlign="left">
      <MKTypography display="block" variant="caption" color="text">
        {degree}
      </MKTypography>
    </MKBox>
  );

  const Choice = ({ name, value }) => {
    const handleSelect = () => {
      if (!selectUser.some((user) => user._id === value._id)) {
        dispatch(setSelectUser([...selectUser, value]));
        dispatch(setSelectAll({ type: role, payload: data.length === selectUser.length + 1 }));
      } else {
        dispatch(setSelectAll({ type: role, payload: data.length === selectUser.length - 1 }));
        dispatch(setSelectUser(selectUser.filter((user) => user._id !== value._id)));
      }
    };
    return (
      <MKBox>
        <Checkbox
          onChange={handleSelect}
          sx={{ width: "100%" }}
          checked={selectUser?.some((s) => s._id === value._id)}
          name={name}
        />
      </MKBox>
    );
  };
  const AllChoices = () => {
    const handleAllChoices = () => {
      dispatch(setSelectUser(data.length === selectUser.length ? [] : data));
    };
    const handleChange = () => dispatch(setSelectAll({ type: role, payload: !selectAll.payload }));

    return (
      <MKBox onClick={handleAllChoices}>
        <Checkbox
          onChange={handleChange}
          checked={selectAll.payload}
          name="all"
          sx={{ width: "100%" }}
        />
      </MKBox>
    );
  };

  MenteeCount.propTypes = {
    menteeCount: PropTypes.number,
  };
  ClassCount.propTypes = {
    classCount: PropTypes.number.isRequired,
  };
  Categories.propTypes = {
    categories: PropTypes.array.isRequired,
  };
  Degree.propTypes = {
    degree: PropTypes.string,
  };
  Choice.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.object.isRequired,
  };
  AllChoices.propTypes = {};
  User.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  };
  const rows = data?.map((user) => {
    let result = {
      choice: <Choice name="mentor_selected" value={user} />,
      user: <User image={userImg} name={user.username} email={user.email} />,
      status: (
        <MKTypography component="div" variant="caption" color="text" fontWeight="medium">
          {user.status}
        </MKTypography>
      ),
      gender: (
        <MKTypography component="div" variant="caption" color="text" fontWeight="medium">
          {user.gender ? "Nam" : "Nữ"}
        </MKTypography>
      ),
    };
    if (role === 4)
      result = {
        ...result,
        rollNumber: (
          <MKTypography component="div" variant="caption" color="text" fontWeight="medium">
            {user?.rollNumber}
          </MKTypography>
        ),
      };
    else if (role === 3)
      result = {
        ...result,
        menteeCount: <MenteeCount menteeCount={user?.menteeCount} />,
        degree: <Degree degree={user?.degree} />,
        categories: <Categories categories={user?.categories} />,
      };
    else if (role === 2)
      result = { ...result, classCount: <ClassCount classCount={user?.classCount} /> };
    return result;
  });

  let columns = [
    {
      Header: <AllChoices />,
      accessor: "choice",
      width: "0px",
      align: "center",
    },
    { Header: "người dùng", accessor: "user", align: "left" },
    { Header: "trạng thái", accessor: "status", align: "center" },
    { Header: "giới tính", accessor: "gender", align: "center" },
  ];
  if (role === 4) columns.push({ Header: "Mã SV", accessor: "rollNumber", align: "center" });
  else if (role === 3)
    columns.push(
      { Header: "giới hạn", accessor: "menteeCount", align: "center" },
      { Header: "bằng cấp", accessor: "degree", align: "left" },
      { Header: "lĩnh vực", accessor: "categories", align: "left" }
    );
  else if (role === 2) columns.push({ Header: "Lớp dạy", accessor: "classCount", align: "center" });

  return {
    columns: columns,

    rows: rows,
  };
}
