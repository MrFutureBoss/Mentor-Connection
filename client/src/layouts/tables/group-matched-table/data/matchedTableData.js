import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MKAvatar from "components/MKAvatar";
import userImg from "assets/images/user.jpg";
import { setDelMatched } from "app/slices/temporaryMatching";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { useState } from "react";

export default function data() {
  const { groupsMatched } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleUserDetailClick = (userId) => {
    navigate(`/user/${userId}/profile`);
  };
  const handleGroupDetailClick = (groupId) => {
    navigate(`/group/${groupId}/members`);
  };
  const Groups = ({ _id, name }) => (
    <MKBox
      onClick={() => handleGroupDetailClick(_id)}
      display="flex"
      alignItems="center"
      lineHeight={1}
      sx={{ userSelect: "none", cursor: "pointer" }}
    >
      <MKBox ml={1} lineHeight={1}>
        <MKTypography component="div" variant="caption" color="text" fontWeight="medium">
          {name}
        </MKTypography>
      </MKBox>
    </MKBox>
  );
  const Mentor = ({ _id, image, name, email, phone }) => (
    <MKBox
      onClick={() => handleUserDetailClick(_id)}
      display="flex"
      sx={{ userSelect: "none", cursor: "pointer" }}
    >
      <MKAvatar src={image} name={name} size="md" />
      <MKBox ml={1} lineHeight={1}>
        <MKTypography display="block" variant="button" color="text" fontWeight="medium">
          {name}
        </MKTypography>
        <MKTypography
          mb={"2px"}
          sx={{ fontStyle: "italic" }}
          display="block"
          variant="caption"
          color="text"
          fontWeight="bold"
        >
          {email}
        </MKTypography>
        <MKTypography display="block" variant="caption" color="text" fontWeight="bold">
          {phone}
        </MKTypography>
      </MKBox>
    </MKBox>
  );

  const Action = ({ groups }) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handleConfirmDelete = () => {
      console.log(groups);
      dispatch(setDelMatched(groups));
      setOpen(false);
    };

    return (
      <MKBox
        sx={{ cursor: "pointer", userSelect: "none" }}
        color="text"
        fontWeight="medium"
        fontSize="0.725rem"
      >
        <Button onClick={handleClickOpen}>Xóa</Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Xác Nhận"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Bạn có chắc chắn muốn xoá nhóm đã được ghép này không?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Huỷ</Button>
            <Button onClick={handleConfirmDelete} color="primary" autoFocus>
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </MKBox>
    );
  };

  Action.propTypes = {
    groups: PropTypes.object.isRequired,
  };

  Groups.propTypes = {
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  };
  Mentor.propTypes = {
    _id: PropTypes.string.isRequired,

    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.number.isRequired,
  };
  const rows =
    groupsMatched?.map((groups) => {
      let result = {
        group: <Groups _id={groups.groupId} name={groups.groupName} />,
        class: (
          <MKTypography component="div" variant="caption" color="text" fontWeight="medium">
            {groups.className}
          </MKTypography>
        ),
        project: (
          <MKTypography component="div" variant="caption" color="text" fontWeight="medium">
            {groups.projectName}
          </MKTypography>
        ),
        projectcategory: (
          <MKTypography component="div" variant="caption" color="text" fontWeight="medium">
            {groups.projectCategories.join(", ")}{" "}
          </MKTypography>
        ),
        mentor: (
          <Mentor
            _id={groups.mentorId}
            image={userImg}
            name={groups.mentorName}
            email={groups.mentorEmail}
            phone={groups.mentorPhone}
          />
        ),
        mentorcategory: (
          <MKTypography component="div" variant="caption" color="text" fontWeight="medium">
            {groups.mentorCategories.join(",   ")}{" "}
          </MKTypography>
        ),
      };
      result = {
        id: (
          <MKTypography component="span" variant="caption" color="text" fontWeight="medium">
            {groups.groupId}
          </MKTypography>
        ),
        ...result,
        action: <Action groups={groups} />,
      };
      return result;
    }) || [];
  let columns = [
    { Header: "tên nhóm", accessor: "group", align: "left" },
    { Header: "dự án", accessor: "project", align: "left" },
    { Header: "thể loại", accessor: "projectcategory", align: "left" },
    { Header: "tên lớp", accessor: "class", align: "center" },
    { Header: "mentor", accessor: "mentor", align: "left" },
    { Header: "lĩnh vực", accessor: "mentorcategory", align: "left" },
  ];
  columns.push({ Header: "hành động", accessor: "action", align: "center" });

  return {
    columns: columns,
    rows: rows,
  };
}
