// Material Dashboard 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import PropTypes from "prop-types";

// Images
import userImg from "assets/images/user.jpg";
import MKBadge from "components/MKBadge";
import MKAvatar from "components/MKAvatar";
import { useDispatch, useSelector } from "react-redux";
import getDate from "utilities/getDate";
import { setDelUser } from "app/slices/userSlice";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useNavigate } from "react-router-dom";

export default function data() {
  const { data } = useSelector((state) => state.user.users);
  const { userLogin } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUserDetailClick = (userId) => {
    navigate(`/user/${userId}/profile`);
  };
  const User = ({ _id, image, name, email }) => (
    <MKBox
      onClick={() => handleUserDetailClick(_id)}
      display="flex"
      alignItems="center"
      lineHeight={1}
      sx={{ userSelect: "none", cursor: "pointer" }}
    >
      <MKAvatar src={image} name={name} size="md" />
      <MKBox ml={1} lineHeight={1}>
        <MKTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MKTypography>
        <MKTypography variant="caption">{email}</MKTypography>
      </MKBox>
    </MKBox>
  );

  const Action = ({ user }) => {
    const handleDelete = () => {
      if (user.status === "InActive") dispatch(setDelUser(user));
    };
    return (
      <MKBox
        onClick={handleDelete}
        sx={{ cursor: "pointer", userselect: "none" }}
        color={`text`}
        fontWeight="medium"
        fontSize="0.725rem"
      >
        Xóa
      </MKBox>
    );
  };
  Action.propTypes = {
    user: PropTypes.object.isRequired,
  };
  User.propTypes = {
    _id: PropTypes.string.isRequired,

    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  };

  const rows =
    data?.map((user) => {
      let result = {
        user: <User _id={user._id} image={userImg} name={user.username} email={user.email} />,
        role: (
          <MKTypography component="div" variant="caption" color="text" fontWeight="medium">
            {user.role === 4
              ? "Học sinh"
              : user.role === 2
              ? "Giáo viên"
              : user.role === 3
              ? "Người hướng dẫn"
              : "Quản trị viên"}
          </MKTypography>
        ),
        gender: (
          <MKTypography component="div" variant="caption" color="text" fontWeight="medium">
            {user.gender ? "Nam" : "Nữ"}
          </MKTypography>
        ),
        status: (
          <MKTypography component="div" variant="caption" color="text" fontWeight="medium">
            {user.status == "Active" ? "Đang hoạt động" : ""}
          </MKTypography>
        ),
        rollNumber: (
          <MKBox ml={-1}>
            <MKBadge
              badgeContent={user.rollNumber || "ko có"}
              color="success"
              variant="gradient"
              size="sm"
            />
          </MKBox>
        ),
      };
      if (userLogin?.role === 1)
        result = {
          id: (
            <MKTypography component="span" variant="caption" color="text" fontWeight="medium">
              {user._id}
            </MKTypography>
          ),
          ...result,
          action: <Action user={user} />,
          onboard: (
            <MKTypography component="span" variant="caption" color="text" fontWeight="medium">
              {getDate(user.createdAt)}
            </MKTypography>
          ),
        };
      else
        result = {
          ...result,
          isleader: (
            <MKTypography component="div" color="text" size="0.25rem">
              {user.isLeader && <StarBorderIcon color="warning" sx={{ ml: "auto" }} />}
            </MKTypography>
          ),
          group: (
            <MKTypography component="div" variant="caption" color="text" fontWeight="medium">
              {user.groupName}
            </MKTypography>
          ),
        };
      return result;
    }) || [];
  let columns = [
    { Header: "người dùng", accessor: "user", width: "32%", align: "left" },
    { Header: "giới tính", accessor: "gender", align: "center" },
    { Header: "vai trò", accessor: "role", align: "center" },
    { Header: "mã sinh viên", accessor: "rollNumber", align: "center" },
  ];
  if (userLogin?.role === 1) {
    // columns.unshift({ Header: "mã", accessor: "id", align: "center" });
    columns.push(
      { Header: "trạng thái", accessor: "status", align: "center" },
      { Header: "Ngày tạo", accessor: "onboard", align: "center" },
      { Header: "hành động", accessor: "action", align: "center" }
    );
  } else
    columns.push(
      { Header: "nhóm trưởng", accessor: "isleader", align: "center" },
      { Header: "tên nhóm", accessor: "group", align: "center" }
    );
  return {
    columns: columns,
    rows: rows,
  };
}
