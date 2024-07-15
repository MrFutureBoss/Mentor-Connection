import { Typography, Box, Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MKBox from "components/MKBox";
import PropTypes from "prop-types";
import "./studentList.css";
import MKButton from "components/MKButton";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, formatNumber } from "utilities/initialValue";
import { setAllGroup, setGroup } from "app/slices/groupSlice";
import { setActivePopup } from "app/slices/activeSlice";
import { setDefaultMentor } from "app/slices/userSlice";
import MKTypography from "components/MKTypography";
import Pagination from "pagination";
import ExcelJS from "exceljs";
import saveAs from "file-saver";
import { checkError } from "utilities/auth";
import TemporaryMatching from "layouts/sections/featuers/components/FeaturesOne/listTemporaryMaching";

const ViewGroups = ({ teacherId }) => {
  const dispatch = useDispatch();
  const limit = 24;
  const { data: allGroups, total } = useSelector((state) => state.group.allGroups);
  const { pageNo } = useSelector((state) => state.utilities);
  const [qttMatched, setQttMatched] = useState(0);
  const navigate = useNavigate();
  const { active_popup } = useSelector((state) => state.active);
  const isActivePopup = () => dispatch(setActivePopup(!active_popup));
  const skip = pageNo * limit;
  const jwt = localStorage.getItem("jwt");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  let qttPage = total ? Math.ceil(total / limit) : 0;
  useEffect(() => {
    if (teacherId)
      axios
        .get(`${BASE_URL}/teacher/${teacherId}/suggest`, config)
        .then(() => getAllGroups())
        .catch((err) => checkError(err, navigate));
  }, [dispatch, active_popup, teacherId, pageNo]);
  const getAllGroups = () => {
    axios
      .get(`${BASE_URL}/teacher/${teacherId}/groups?skip=${skip}&limit=${limit}`, config)
      .then((res) => dispatch(setAllGroup(res.data)))
      .catch((err) => checkError(err, navigate));
    axios
      .get(`${BASE_URL}/group/${teacherId}/teacher`, config)
      .then((res) => setQttMatched(res.data))
      .catch((err) => checkError(err, navigate));
  };
  useEffect(() => {
    if (teacherId) getAllGroups();
  }, [dispatch, teacherId, pageNo]);
  const handleGroupDetailClick = (groupId) => {
    navigate(`/group/${groupId}/members`);
  };
  const handleClickSuggest = () => {
    if (teacherId)
      axios
        .get(`${BASE_URL}/teacher/${teacherId}/suggest`, config)
        .then(() => getAllGroups())
        .catch((err) => checkError(err, navigate));
  };
  const handleClickSaveAll = () => {
    if (teacherId)
      axios
        .get(`${BASE_URL}/matched/${teacherId}/teacher`, config)
        .then(() => getAllGroups())
        .catch((err) => checkError(err, navigate));
  };
  const handleSaveMatched = (gid, uid) => {
    axios
      .post(
        `${BASE_URL}/matched`,
        { groupId: gid, mentorId: uid, status: "Pending", time: [] },
        config
      )
      .then(() => getAllGroups())
      .catch((err) => checkError(err, navigate));
  };
  const handleClickViewTemporaryMatching = (group, mid) => {
    isActivePopup();
    dispatch(setGroup(group));
    dispatch(setDefaultMentor(mid));
  };
  const handleExportExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Danh_sach_matched");
    const columnNames = [
      "ClassName",
      "RollNumber",
      "MemberCode",
      "Email",
      "Username",
      "Teacher",
      "Project",
      "Acc Mentor",
      "PhoneNumber",
      "Email",
    ];
    worksheet.addRow(columnNames);
    allGroups?.forEach((row) => {
      const { className, project, teacher, members, matched } = row;
      if (matched.length > 0)
        members?.forEach((member) => {
          worksheet.addRow([
            className,
            member.rollNumber,
            member.memberCode,
            member.email,
            member.username,
            teacher.username,
            project.name,
            matched?.[0]?.username,
            matched?.[0]?.phoneNumber,
            matched?.[0]?.email,
          ]);
        });
    });
    columnNames.forEach((header, index) => {
      const column = worksheet.getColumn(index + 1);
      column.eachCell((cell) => {
        const length = String(cell.value).length;
        column.width = Math.max(column.width || 0, length + 2);
      });
    });
    const fileName = "Danh_sach_matched.xlsx";
    workbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(new Blob([buffer], { type: "application/octet-stream" }), fileName);
    });
  };
  const Mentor = ({ image, username, email, mentorcategories, label }) => {
    return (
      <Box
        sx={{
          p: 1.3,
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            mt: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "left",
            width: "100%",
          }}
        >
          <Avatar src={image} alt={username} sx={{ height: "30px", width: "30px", mr: 1 }} />
          <MKBox sx={{ width: "calc(100% - 54px)" }}>
            <Typography
              fontFamily={"Roboto, Helvetica, Arial,sans-serif"}
              fontWeight={"400"}
              fontSize={"0.825rem"}
              className="truncate"
              color="textSecondary"
              noWrap
            >
              <Typography as={"span"} fontSize={"0.825rem"} fontWeight={"500"}>
                Tên:
              </Typography>
              {username}
              <Typography as={"span"} fontSize={"0.825rem"} sx={{ color: "#000" }}>
                <em>{label && `(${label})`}</em>
              </Typography>
            </Typography>
            <Typography
              fontFamily={"Roboto, Helvetica, Arial,sans-serif"}
              fontWeight={"400"}
              fontSize={"0.825rem"}
              className="truncate"
              color="textSecondary"
              noWrap
            >
              <Typography as={"span"} fontSize={"0.825rem"} fontWeight={"500"}>
                Email:
              </Typography>
              {email}
            </Typography>
            <Typography
              fontFamily={"Roboto, Helvetica, Arial,sans-serif"}
              fontWeight={"400"}
              fontSize={"0.825rem"}
              color="textSecondary"
            >
              <Typography as={"span"} fontSize={"0.825rem"} fontWeight={"500"}>
                Lĩnh vực:
              </Typography>
              {mentorcategories?.map((p) => p.name).join(", ")}
            </Typography>
          </MKBox>
        </Box>
      </Box>
    );
  };
  Mentor.propTypes = {
    image: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    mentorcategories: PropTypes.array.isRequired,
    label: PropTypes.string,
  };
  return (
    <>
      <TemporaryMatching />
      <MKBox px={"14px"} my={1} display="flex" justifyContent="end" gap="1.5rem">
        <MKButton onClick={handleExportExcel} sx={{ textTransform: "none" }}>
          Tải file
        </MKButton>
        <MKBox mb="3px" display="flex" alignItems="center" fontSize="0.825rem" gap="0.5rem">
          <MKTypography as="span" fontWeight="medium">
            Được ghép:
          </MKTypography>
          <MKTypography as="span">{formatNumber(qttMatched || 0)}</MKTypography>
        </MKBox>
        <MKBox mb="3px" display="flex" alignItems="center" fontSize="0.825rem" gap="0.5rem">
          <MKTypography as="span" fontWeight="medium">
            Tổng:
          </MKTypography>
          <MKTypography as="span">{formatNumber(total || 0)}</MKTypography>
        </MKBox>
        <MKButton onClick={handleClickSuggest} sx={{ textTransform: "none" }}>
          Gợi ý
        </MKButton>
        <MKButton onClick={handleClickSaveAll} sx={{ textTransform: "none" }}>
          Lưu tất cả
        </MKButton>
      </MKBox>
      <Box
        pb="3rem"
        sx={{
          marginLeft: "16px",
          marginBottom: "10px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        {allGroups?.map((g, i) => (
          <Box
            key={g._id + i}
            sx={{
              display: "flex",
              flexDirection: "column",
              width: `calc(100%/3 - 18px)`,
              minHeight: 186,
              borderRadius: "16px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
              marginBottom: "8px",
              position: "relative",
            }}
          >
            <Box
              className="gradient-animated"
              sx={{
                color: "#fff",
                p: "8px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <MKBox display={"flex"} justifyContent="space-between">
                <Typography
                  flex={1}
                  as="div"
                  sx={{ color: "#fff" }}
                  variant="subtitle1"
                  width="80%"
                  className="truncate"
                >
                  <MKTypography
                    as="span"
                    color="white"
                    fontWeight="bold"
                    sx={{ fontSize: "0.925rem", mr: "4px" }}
                  >
                    Tên: {g.group?.name}
                  </MKTypography>
                  <MKTypography as="span" color="white" sx={{ fontSize: "0.925rem" }}>
                    <i>({g.className})</i>
                  </MKTypography>
                </Typography>
                <MKButton
                  disabled={g.matched?.length > 0 || g.matching?.length === 0}
                  onClick={() => handleSaveMatched(g.group?._id, g.matching?.[0]?._id)}
                  sx={{ minHeight: "0", padding: "0" }}
                >
                  Lưu
                </MKButton>
              </MKBox>
              <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                Tên dự án: {g.project?.name}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.8rem" }} className="truncate">
                Lĩnh vực: {g.projectcategories?.map((p) => p.name).join(", ")}
              </Typography>
            </Box>
            {g.matching.length > 0 && (
              <>
                <Mentor
                  username={g.matching[0]?.username}
                  image={g.matching[0]?.image || ""}
                  email={g.matching[0]?.email}
                  mentorcategories={g.matchingMentorcategories}
                  label="Mặc định"
                />
                <Typography
                  fontWeight={"400"}
                  fontSize={"0.725rem"}
                  color="textSecondary"
                  textAlign={"end"}
                  mx="14px"
                  sx={{ cursor: "pointer" }}
                  px="6px"
                  py="2px"
                  my="2px"
                  onClick={() => handleClickViewTemporaryMatching(g.group, g.matching[0]?._id)}
                >
                  <em>Danh sách Mentor</em>
                </Typography>
              </>
            )}
            {g.matching.length === 0 && g.matched.length === 0 && (
              <Typography
                as={"span"}
                fontSize={"0.725rem"}
                display={"flex"}
                textAlign={"center"}
                alignItems={"center"}
                sx={{ color: "#000", p: 1.3, flexGrow: 1, display: "flex", alignItems: "center" }}
              >
                <em>Chưa tìm thấy người hướng dẫn phù hợp</em>
              </Typography>
            )}
            {g.matched.length > 0 && (
              <Mentor
                username={g.matched[0]?.username}
                image={g.matched[0]?.image || ""}
                email={g.matched[0]?.email}
                mentorcategories={g.matchedMentorcategories}
              />
            )}
            <Box
              px={2}
              py={1}
              sx={{
                bgcolor: "#F4F4F4",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography fontSize={"0.825rem"} variant="body2">
                {g?.members?.length} Thành viên
              </Typography>
              <Typography
                variant="body2"
                fontSize={"0.725rem"}
                sx={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => handleGroupDetailClick(g.group._id)}
              >
                <em>Chi tiết nhóm</em>
              </Typography>
            </Box>
          </Box>
        ))}
        {qttPage > 1 && <Pagination pageNo={pageNo} qttPage={qttPage} />}
      </Box>
      {allGroups?.length === 0 && (
        <MKBox lineHeight={1} textAlign="center" width={"100%"}>
          <MKTypography
            mt="1rem"
            display="block"
            variant="caption"
            color="text"
            fontSize="1rem"
            fontWeight="medium"
          >
            Chưa có nhóm được tạo...
          </MKTypography>
        </MKBox>
      )}
    </>
  );
};

ViewGroups.defaultProps = {
  teacherId: "",
};
ViewGroups.propTypes = {
  teacherId: PropTypes.string.isRequired,
};

export default ViewGroups;
