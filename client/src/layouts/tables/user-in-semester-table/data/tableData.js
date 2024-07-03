// Material Dashboard 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import PropTypes from "prop-types";

// Images
import userImg from "assets/images/user.jpg";
import MKAvatar from "components/MKAvatar";
import { useDispatch, useSelector } from "react-redux";
import MKButton from "components/MKButton";
import axios from "axios";
import { BASE_URL } from "utilities/initialValue";
import { setUsersInSmt } from "app/slices/semesterSlice";

export default function data() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.semester.usersInSmt);
  const { role } = useSelector((state) => state.user);
  const { pageNo, limit } = useSelector((state) => state.utilities);
  const { data: semesters } = useSelector((state) => state.semester.semesters);
  const { semester } = useSelector((state) => state.semester);
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
  const Action = ({ smtDet }) => {
    const status =
      semesters?.find((s) => s._id === semester?._id)?.status || semesters?.[0]?.status;
    const jwt = localStorage.getItem("jwt");
    const config = {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${jwt}`,
      },
    };
    const skip = pageNo * limit;
    const handleDelete = () => {
      if (status === "Upcoming")
        axios
          .delete(`${BASE_URL}/semester_detail/${smtDet?._id}`, config)
          .then(() =>
            axios
              .get(
                `${BASE_URL}/semester_detail/${smtDet?.semesterId}/semester/${role}/users?skip=${skip}`,
                config
              )
              .then((res) => dispatch(setUsersInSmt(res.data)))
              .catch((err) => console.log(err))
          )
          .catch((err) => console.log(err));
    };
    return (
      <MKBox>
        <MKButton
          onClick={handleDelete}
          disabled={status !== "Upcoming"}
          sx={{ textTransform: "none" }}
        >
          Xóa
        </MKButton>
      </MKBox>
    );
  };
  User.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
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
  Action.propTypes = {
    smtDet: PropTypes.object.isRequired,
  };

  const rows =
    data?.map((semester) => {
      let result = {
        user: (
          <User image={userImg} name={semester?.user?.username} email={semester?.user?.email} />
        ),
        status: (
          <MKTypography component="div" variant="caption" color="text" fontWeight="medium">
            {semester?.user?.status}
          </MKTypography>
        ),
        gender: (
          <MKTypography component="div" variant="caption" color="text" fontWeight="medium">
            {semester?.user?.gender ? "Nam" : "Nữ"}
          </MKTypography>
        ),
      };
      if (role === 4)
        result = {
          ...result,
          rollNumber: (
            <MKTypography component="div" variant="caption" color="text" fontWeight="medium">
              {semester?.user?.rollNumber}
            </MKTypography>
          ),
        };
      else if (role === 3)
        result = {
          ...result,
          menteeCount: <MenteeCount menteeCount={semester?.user?.menteeCount} />,
          degree: <Degree degree={semester?.user?.degree} />,
          categories: <Categories categories={semester?.user?.categories} />,
        };
      else if (role === 2)
        result = { ...result, classCount: <ClassCount classCount={semester?.user?.classCount} /> };
      result = { ...result, action: <Action smtDet={semester} /> };
      return result;
    }) || [];
  const columns = [
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
  columns.push({ Header: "hành động", accessor: "action", align: "center" });
  return {
    columns: columns,
    rows: rows,
  };
}
