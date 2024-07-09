// Material Dashboard 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import PropTypes from "prop-types";

// Images
import userImg from "assets/images/user.jpg";
import MKAvatar from "components/MKAvatar";
import { useDispatch, useSelector } from "react-redux";
import { Radio, Typography } from "@mui/material";
import { setMentorChoice } from "app/slices/temporaryMatching";

export default function data() {
  const { data } = useSelector((state) => state.temporaryMatching.temporaryMatching);
  const { defaultMentor } = useSelector((state) => state.user);
  const { mentorChoice } = useSelector((state) => state.temporaryMatching);
  const User = ({ image, name, email, id }) => (
    <MKBox display="flex" alignItems="center" gap={"0.5rem"} lineHeight={1}>
      <MKAvatar src={image} name={name} size="md" />
      <MKBox lineHeight={1}>
        <MKTypography display="block" variant="button" fontWeight="medium">
          {name}
          <Typography as={"span"} fontSize={"0.625rem"} sx={{ color: "#000" }}>
            <em>{defaultMentor === id && "(Mặc định)"}</em>
          </Typography>
        </MKTypography>
        <MKTypography variant="caption">{email}</MKTypography>
      </MKBox>
    </MKBox>
  );
  const Choice = ({ name, value }) => {
    const dispatch = useDispatch();
    return (
      <Radio
        checked={value._id === mentorChoice._id}
        onChange={() => dispatch(setMentorChoice(value))}
        value={value._id}
        name={name}
        inputProps={{ "aria-label": "A" }}
      />
    );
  };
  const Details = ({ description }) => (
    <MKBox lineHeight={1} textAlign="left">
      <MKTypography variant="caption">{description}</MKTypography>
    </MKBox>
  );
  const MentorCategories = ({ categories }) => (
    <MKBox lineHeight={1} textAlign="left">
      <MKTypography variant="caption">{categories?.map((c) => c.name)?.join(", ")}</MKTypography>
    </MKBox>
  );
  const MentorCount = ({ count }) => (
    <MKBox lineHeight={1} textAlign="left">
      <MKTypography variant="caption">{count}</MKTypography>
    </MKBox>
  );
  const Gender = ({ sex }) => (
    <MKTypography component="div" variant="caption" color="text" fontWeight="medium">
      {sex ? "Nam" : "Nữ"}
    </MKTypography>
  );
  User.propTypes = {
    id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  };
  Choice.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  };
  Details.propTypes = {
    description: PropTypes.string.isRequired,
  };
  MentorCategories.propTypes = {
    categories: PropTypes.string.isRequired,
  };
  MentorCount.propTypes = {
    count: PropTypes.string.isRequired,
  };
  Gender.propTypes = {
    sex: PropTypes.bool.isRequired,
  };
  const rows = data?.map((item) => ({
    choice: <Choice name="mentor" value={item} />,
    user: <User image={userImg} id={item?._id} name={item?.username} email={item?.email} />,
    gender: <Gender sex={item?.gender} />,
    categories: <MentorCategories categories={item?.mentorcategories} />,
    degree: <Details description={item?.degree} />,
    count: <MentorCount count={item?.menteeCount} />,
  }));

  return {
    columns: [
      { accessor: "choice", width: "0px", align: "left" },
      { Header: "Người hướng dẫn", accessor: "user", align: "left" },
      { Header: "giới tính", accessor: "gender", width: "15%", align: "center" },
      { Header: "Lĩnh vực", accessor: "categories", width: "auto", align: "left" },
      { Header: "giới hạn", accessor: "count", width: "auto", align: "center" },
      { Header: "kinh nghiệm", accessor: "degree", width: "auto", align: "left" },
    ],
    rows: rows,
  };
}
