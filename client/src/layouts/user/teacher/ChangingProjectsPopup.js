import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { checkError } from "utilities/auth";
import { BASE_URL } from "utilities/initialValue";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

// Thêm CSS trực tiếp vào JS để ghi đè z-index của SweetAlert
const swalStyles = `
  .swal2-container {
    z-index: 2000 !important;
  }
`;

const ChangingProjectsPopup = ({ open, handleClose }) => {
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  const { userLogin } = useSelector((state) => state.user);

  const [changingProjects, setChangingProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [confirmActionType, setConfirmActionType] = useState("");
  const [declineMessage, setDeclineMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(open);

  useEffect(() => {
    setIsDialogOpen(open);
  }, [open]);

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

      Swal.fire({
        title: successMessage,
        icon: "success",
      });

      fetchChangingProjects();
    } catch (error) {
      checkError(error, navigate);
      Swal.fire({
        title: errorMessage,
        icon: "error",
      });
    }
  };

  const confirmAction = (actionType, projectId) => {
    setSelectedProjectId(projectId);
    setConfirmActionType(actionType);
    if (actionType === "decline") {
      setIsDialogOpen(false);
      Swal.fire({
        title: "Bạn có chắc chắn muốn từ chối dự án này?",
        icon: "warning",
        input: "textarea",
        inputLabel: "Lý do từ chối",
        inputPlaceholder: "Nhập lý do từ chối...",
        inputAttributes: {
          "aria-label": "Nhập lý do từ chối",
        },
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
        inputValidator: (value) => {
          if (!value) {
            return "Bạn cần nhập lý do từ chối!";
          }
        },
        preConfirm: (value) => {
          return new Promise((resolve) => {
            setDeclineMessage(value);
            resolve();
          });
        },
      }).then((result) => {
        if (result.isConfirmed) {
          handleAction();
        } else {
          setIsDialogOpen(true);
        }
      });
    } else {
      Swal.fire({
        title: "Bạn có chắc chắn muốn duyệt dự án này?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          handleAction();
        }
      });
    }
  };

  const handlePopupClose = () => {
    setIsDialogOpen(false);
    handleClose();
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
      <style>{swalStyles}</style>
      <Dialog open={isDialogOpen} onClose={handlePopupClose} fullWidth maxWidth="xl">
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
          <Button onClick={handlePopupClose} color="secondary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

ChangingProjectsPopup.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ChangingProjectsPopup;
