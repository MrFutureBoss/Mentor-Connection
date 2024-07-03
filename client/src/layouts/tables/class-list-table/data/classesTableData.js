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
import { setdeleteClass, setEditClass } from "app/slices/classSlice";
import { Link } from "react-router-dom";

export default function data() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.class.classes);
  const checkStatus = (status) => {
    if (status === "Active") {
      return "success";
    } else if (status === "InActive") {
      return "warning";
    } else {
      return "danger";
    }
  };
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

  const Role = ({ title, description }) => (
    <MKBox lineHeight={1} textAlign="left">
      <MKTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MKTypography>
      <MKTypography variant="caption">{description}</MKTypography>
    </MKBox>
  );
  User.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  };

  Role.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  };
  const rows = data
    ? data.map((c) => ({
        code: (
          <MKTypography component="div" variant="caption" color="text" fontWeight="medium">
            {c._id}
          </MKTypography>
        ),
        name: (
          <MKTypography component="div" variant="caption" color="text" fontWeight="medium">
            {c.className}
          </MKTypography>
        ),
        qttStudent: (
          <MKTypography component="div" variant="caption" color="text" fontWeight="medium">
            {c.limitStudent}
          </MKTypography>
        ),
        curQttStudent: (
          <MKTypography component="span" variant="caption" color="text" fontWeight="medium">
            {c.userCount}
          </MKTypography>
        ),
        teacher: <User image={userImg} name={c.teacher.username} email={c.teacher.email} />,
        status: (
          <MKBox ml={-1}>
            <MKBadge
              badgeContent={c.status}
              color={checkStatus(c.status)}
              variant="gradient"
              size="sm"
            />
          </MKBox>
        ),
        onboard: (
          <MKTypography component="span" variant="caption" color="text" fontWeight="medium">
            {getDate(c.createdAt)}
          </MKTypography>
        ),
        semester:
          c.semester.length > 0 ? (
            <MKTypography component="span" variant="caption" color="text" fontWeight="medium">
              {c.semester?.[0]?.name}
            </MKTypography>
          ) : (
            <MKTypography component="span" variant="caption" color="text" fontWeight="medium">
              Chưa có
            </MKTypography>
          ),
        action: (
          <MKBox display="flex" gap="0.5rem">
            {c.userCount === 0 ? (
              <MKTypography
                onClick={() => dispatch(setdeleteClass(c))}
                component="span"
                variant="caption"
                color="text"
                fontWeight="medium"
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    color: "#000000",
                  },
                }}
              >
                Delete
              </MKTypography>
            ) : (
              <MKTypography
                onClick={() => dispatch(setEditClass(c))}
                component="span"
                variant="caption"
                color="text"
                fontWeight="medium"
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    color: "#000000",
                  },
                }}
              >
                <Link to={`/presentation/class/${c._id}`} underline="hover">
                  Xem
                </Link>
              </MKTypography>
            )}
          </MKBox>
        ),
      }))
    : [];

  return {
    columns: [
      { Header: "mã lớp", accessor: "code", align: "center" },
      { Header: "tên lớp", accessor: "name", align: "center" },
      {
        Header: "giới hạn",
        accessor: "qttStudent",
        align: "center",
      },
      {
        Header: "sinh viên",
        accessor: "curQttStudent",
        align: "center",
      },
      { Header: "giáo viên", accessor: "teacher", align: "left" },
      { Header: "trạng thái", accessor: "status", align: "center" },
      { Header: "onboard", accessor: "onboard", width: "10%", align: "center" },
      { Header: "kì học", accessor: "semester", align: "center" },
      { Header: "hành động", accessor: "action", align: "center" },
    ],

    rows: rows,
  };
}
