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
  Backdrop,
} from "@mui/material";
import { checkError } from "utilities/auth";
import { BASE_URL } from "utilities/initialValue";
import { setProjectRequest } from "app/slices/projectSlice";
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
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false); // State to control confirm dialog
  const [selectedProjectId, setSelectedProjectId] = useState(null); // State to store selected project ID
  const [confirmActionType, setConfirmActionType] = useState(""); // State to store the type of action to confirm

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
          dispatch(setProjectRequest(res.data));
        })
        .catch((err) => checkError(err, navigate));
    }
  }, [dispatch, navigate, jwt, userLogin]);

  const findProjectName = (projectId) => {
    const project = currentProjects.find((proj) => proj.projectId === projectId);
    return project ? project.projectName : "Unknown";
  };

  const handleAction = () => {
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

    axios
      .put(
        apiUrl,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then(() => {
        const updatedProjects = currentProjects.filter(
          (project) => project.projectId !== selectedProjectId
        );
        setCurrentProjects(updatedProjects);

        if (confirmActionType === "approve") {
          toast.success(successMessage, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            icon: <CheckCircleIcon />,
          });
        } else if (confirmActionType === "decline") {
          toast.error(successMessage, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            icon: <CancelIcon />,
          });
        }

        handleCloseDialog();
      })
      .catch((err) => {
        checkError(err, navigate);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          icon: <CancelIcon />,
        });

        handleCloseDialog();
      });
  };

  const confirmAction = (projectId, actionType) => {
    setSelectedProjectId(projectId);
    setConfirmActionType(actionType);
    setConfirmDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedProjectId(null);
    setConfirmActionType("");
    setConfirmDialogOpen(false);
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
            />
          </Box>
        </Box>
      </Slide>

      {/* Confirm dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="xs"
        TransitionComponent={Slide}
        TransitionProps={{ direction: "up" }}
        BackdropComponent={Backdrop}
        BackdropProps={{ invisible: true }}
      >
        <DialogTitle>Xác nhận</DialogTitle>
        <DialogContent>
          <p>Bạn có chắc chắn muốn thực hiện hành động này?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAction} color="primary">
            Đồng ý
          </Button>
          <Button onClick={handleCloseDialog} color="secondary">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </>
  );
};

export default ProjectRequest;
