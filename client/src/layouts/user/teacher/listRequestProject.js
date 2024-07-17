import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Slide, Box } from "@mui/material";
import { checkError } from "utilities/auth";
import { BASE_URL } from "utilities/initialValue";
import Swal from "sweetalert2";

const ProjectRequest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  const { userLogin } = useSelector((state) => state.user);

  const [currentProjects, setCurrentProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null); // State to store selected project ID
  const [confirmActionType, setConfirmActionType] = useState(""); // State to store the type of action to confirm
  const [declineMessage, setDeclineMessage] = useState(""); // State to store decline message

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
        { declineMessage }, // Send decline message in the request body
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
          Swal.fire({
            title: successMessage,
            icon: "success",
            timer: 5000,
            showConfirmButton: false,
          });
        } else if (confirmActionType === "decline") {
          Swal.fire({
            title: successMessage,
            icon: "error",
            timer: 5000,
            showConfirmButton: false,
          });
        }
      })
      .catch((err) => {
        checkError(err, navigate);
        Swal.fire({
          title: errorMessage,
          icon: "error",
          timer: 5000,
          showConfirmButton: false,
        });
      });
  };

  const confirmAction = (projectId, actionType) => {
    setSelectedProjectId(projectId);
    setConfirmActionType(actionType);
    if (actionType === "decline") {
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
      }).then((result) => {
        if (result.isConfirmed) {
          setDeclineMessage(result.value);
          handleAction();
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
    </>
  );
};

export default ProjectRequest;
