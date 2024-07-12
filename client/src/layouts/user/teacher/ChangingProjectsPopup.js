import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
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
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false); // State to control confirm dialog
  const [selectedProjectId, setSelectedProjectId] = useState(null); // State to store selected project ID
  const [confirmActionType, setConfirmActionType] = useState(""); // State to store the type of action to confirm
  const [toastMessage, setToastMessage] = useState(""); // State to store toast message
  const [toastType, setToastType] = useState("success"); // State to store toast type (success or error)

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
        {},
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
      fetchChangingProjects(); // Lấy lại danh sách dự án sau khi thực hiện hành động
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
    setConfirmDialogOpen(true); // Mở cửa sổ xác nhận trước khi thực hiện hành động
  };

  const handleCloseDialog = () => {
    setSelectedProjectId(null);
    setConfirmActionType("");
    setConfirmDialogOpen(false); // Đóng cửa sổ xác nhận
  };

  const handleCloseToast = () => {
    setToastMessage("");
    toast.dismiss();
  };
  const handlePopupClose = () => {
    handleCloseToast(); // Dismiss toasts when popup closes
    handleClose(); // Close the popup
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

        {/* ToastContainer để hiển thị toast trên popup */}
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
          limit={1} // Chỉ hiển thị 1 thông báo
          style={{ zIndex: 9999 }} // Đảm bảo hiển thị trên các thành phần khác
        />
      </Dialog>

      {/* Cửa sổ xác nhận */}
      {confirmDialogOpen && (
        <Dialog open={true} fullWidth maxWidth="xs">
          <DialogTitle>Xác nhận</DialogTitle>
          <DialogContent>
            <p>Bạn có chắc chắn muốn thực hiện hành động này?</p>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleAction(); // Thực hiện hành động duyệt hoặc từ chối
              }}
              color="primary"
            >
              Đồng ý
            </Button>
            <Button
              onClick={() => {
                handleCloseDialog(); // Đóng cửa sổ xác nhận
              }}
              color="secondary"
            >
              Từ chối
            </Button>
          </DialogActions>
        </Dialog>
      )}

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
          onClose: handleCloseToast, // Xử lý khi đóng toast
        })}
    </>
  );
};

ChangingProjectsPopup.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ChangingProjectsPopup;
