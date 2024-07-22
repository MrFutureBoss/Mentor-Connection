import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Slide,
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

const ProjectRequest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  const { userLogin } = useSelector((state) => state.user);

  const [currentProjects, setCurrentProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [confirmActionType, setConfirmActionType] = useState("");
  const [declineMessage, setDeclineMessage] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    if (userLogin?._id) {
      axios
        .get(`${BASE_URL}/project/planning-projects/${userLogin._id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((res) => {
          setCurrentProjects(res.data);
        })
        .catch((err) => checkError(err, navigate));
    }
  }, [dispatch, navigate, jwt, userLogin]);

  const findProjectName = (projectId) => {
    const project = currentProjects.find((proj) => proj.projectId === projectId);
    return project ? project.projectName : "Unknown";
  };

  const handleAction = async () => {
    if (!selectedProjectId || !confirmActionType) return;

    let apiUrl = "";
    let successMessage = "";
    let errorMessage = "";

    if (confirmActionType === "approve") {
      apiUrl = `${BASE_URL}/project/approve/planning/${selectedProjectId}`;
      successMessage = `Đã duyệt dự án: ${findProjectName(selectedProjectId)}`;
      errorMessage = "Đã xảy ra lỗi khi duyệt dự án";
    } else if (confirmActionType === "decline") {
      apiUrl = `${BASE_URL}/project/decline/planning/${selectedProjectId}`;
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

      const updatedProjects = currentProjects.filter(
        (project) => project.projectId !== selectedProjectId
      );
      setCurrentProjects(updatedProjects);

      handleToast(successMessage, "success");
      handleCloseDialog();
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

  const confirmAction = (projectId, actionType) => {
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
      flex: 1.1,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => confirmAction(params.id, "approve")}
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
            onClick={() => confirmAction(params.id, "decline")}
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

  const rows = currentProjects.map((project, index) => ({
    id: project.projectId || index,
    groupName: project.groupName,
    projectName: project.projectName,
    categories: project.categories,
  }));

  return (
    <>
      <Slide direction="down" in={true} timeout={500}>
        <Box
          sx={{ width: "100%", height: "calc(100% - 48px)", padding: "16px", overflow: "hidden" }}
        >
          <Box sx={{ height: 640, width: "100%" }}>
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
        </Box>
      </Slide>

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
          onClose: () => setToastMessage(""), // Xử lý khi đóng toast
        })}
    </>
  );
};

export default ProjectRequest;
