import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { checkError } from "utilities/auth";
import { BASE_URL } from "utilities/initialValue";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PropTypes from "prop-types";

const ChangingProjectsPopup = ({ open, handleClose }) => {
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  const { userLogin } = useSelector((state) => state.user);

  const [changingProjects, setChangingProjects] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [confirmActionType, setConfirmActionType] = useState("");
  const [declineMessage, setDeclineMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    fetchChangingProjects();
  }, []);

  const fetchChangingProjects = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/project/changing-projects/${userLogin._id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
      setChangingProjects(response.data);
    } catch (error) {
      checkError(error, navigate);
    }
  };

  const findProjectName = (projectId) => {
    const project = changingProjects.find((proj) => proj.projectId === projectId);
    return project ? project.projectName : "Unknown";
  };

  const handleAction = async () => {
    if (!selectedProjectId || !confirmActionType) return;

    let apiUrl = "";
    let successMessage = "";
    let errorMessage = "";

    if (confirmActionType === "approve") {
      apiUrl = `${BASE_URL}/project/approve/changing/${selectedProjectId}`;
      successMessage = `Đã duyệt dự án: ${findProjectName(selectedProjectId)}`;
      errorMessage = "Đã xảy ra lỗi khi duyệt dự án";
    } else if (confirmActionType === "decline") {
      apiUrl = `${BASE_URL}/project/decline/changing/${selectedProjectId}`;
      successMessage = `Đã từ chối dự án: ${findProjectName(selectedProjectId)}`;
      errorMessage = "Đã xảy ra lỗi khi từ chối dự án";
    }

    try {
      await axios.put(
        apiUrl,
        { declineMessage },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      const updatedProjects = changingProjects.filter(
        (project) => project.projectId !== selectedProjectId
      );
      setChangingProjects(updatedProjects);

      if (confirmActionType === "approve") {
        handleToast(successMessage, "success");
      } else if (confirmActionType === "decline") {
        handleToast(successMessage, "error");
      }

      handleCloseDialog();
      fetchChangingProjects();
    } catch (error) {
      checkError(error, navigate);
      handleToast(errorMessage, "error");
      handleCloseDialog();
    }
  };

  const handleToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
  };

  const confirmAction = (actionType, projectId) => {
    setSelectedProjectId(projectId);
    setConfirmActionType(actionType);
    if (actionType === "decline") {
      setConfirmDialogOpen(true);
    } else {
      handleAction();
    }
  };

  const handleCloseDialog = () => {
    setSelectedProjectId(null);
    setConfirmActionType("");
    setDeclineMessage("");
    setConfirmDialogOpen(false);
  };

  const handleCloseToast = () => {
    setToastMessage("");
    toast.dismiss();
  };

  const handlePopupClose = () => {
    handleCloseToast();
    handleClose();
  };

  const handleDeclineConfirm = () => {
    if (!declineMessage) {
      handleToast("Bạn cần nhập lý do từ chối!", "error");
      return;
    }
    handleAction();
  };

  const columns = [
    { field: "groupName", headerName: "Tên nhóm", flex: 1 },
    { field: "projectName", headerName: "Tên dự án", flex: 1.5 },
    {
      field: "categories",
      headerName: "Danh mục",
      flex: 4,
      renderCell: (params) =>
        params.value.length > 0 ? params.value.join(", ") : "Không có danh mục",
    },
    {
      field: "actions",
      headerName: "Hành động",
      flex: 1.3,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => confirmAction("approve", params.id)}
            sx={{
              textTransform: "none",
              borderRadius: "20px",
              backgroundColor: "#4caf50",
              color: "#ffffff",
              marginRight: "10px",
            }}
          >
            Duyệt
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => confirmAction("decline", params.id)}
            sx={{
              textTransform: "none",
              borderRadius: "20px",
              backgroundColor: "#f44336",
              color: "#ffffff",
            }}
          >
            Từ chối
          </Button>
        </div>
      ),
    },
  ];

  const rows = changingProjects.map((project, index) => ({
    id: project.projectId || index,
    groupName: project.groupName,
    projectName: project.projectName,
    categories: project.categories,
  }));

  return (
    <>
      <Dialog open={open} onClose={handlePopupClose} fullWidth maxWidth="xl">
        <DialogTitle>Danh sách các nhóm cần cập nhật lại dự án</DialogTitle>
        <DialogContent>
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[13]}
              pagination
              disableSelectionOnClick
              components={{
                NoRowsOverlay: () => (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      fontSize: "1.2rem",
                    }}
                  >
                    Chưa có dự án nào cần duyệt
                  </Box>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Đóng
          </Button>
        </DialogActions>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          progress={undefined}
          newestOnTop={false}
          rtl={false}
          pauseOnFocusLoss
          limit={1}
          style={{ zIndex: 9999 }}
        />
      </Dialog>

      <Dialog open={confirmDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Xác nhận từ chối dự án</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="decline-reason"
            label="Lý do từ chối"
            type="text"
            fullWidth
            variant="standard"
            value={declineMessage}
            onChange={(e) => setDeclineMessage(e.target.value)}
            error={!!declineMessage && declineMessage.trim() === ""}
            helperText={
              !!declineMessage && declineMessage.trim() === "" ? "Bạn cần nhập lý do từ chối" : ""
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeclineConfirm} color="primary">
            Đồng ý
          </Button>
          <Button onClick={handleCloseDialog} color="secondary">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      {toastMessage &&
        toast(toastMessage, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          icon: toastType === "success" ? <CheckCircleIcon /> : <CancelIcon />,
          onClose: handleCloseToast,
        })}
    </>
  );
};

ChangingProjectsPopup.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ChangingProjectsPopup;
