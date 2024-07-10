import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Slide, Box } from "@mui/material";
import { checkError } from "utilities/auth";
import { BASE_URL } from "utilities/initialValue";
import { setProjectRequest } from "app/slices/projectSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const ProjectRequest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  const { userLogin } = useSelector((state) => state.user);

  const [currentProjects, setCurrentProjects] = useState([]);

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

  const handleApprove = (projectId) => {
    axios
      .put(
        `${BASE_URL}/project/approve/${projectId}`,
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
          (project) => project.projectId !== projectId
        );
        setCurrentProjects(updatedProjects);

        toast.success(`Đã duyệt dự án: ${findProjectName(projectId)}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          icon: <CheckCircleIcon />,
        });
      })
      .catch((err) => {
        checkError(err, navigate);
      });
  };
  console.log(currentProjects);

  const handleDecline = (projectId) => {
    axios
      .put(
        `${BASE_URL}/project/decline/${projectId}`,
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
          (project) => project.projectId !== projectId
        );
        setCurrentProjects(updatedProjects);
        toast.error(`Đã từ chối dự án: ${findProjectName(projectId)}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          icon: <CancelIcon />,
        });
      })
      .catch((err) => {
        checkError(err, navigate);
      });
  };
  const confirmAction = (action, projectId) => {
    confirmAlert({
      title: "Xác nhận",
      message: "Bạn có chắc chắn muốn thực hiện hành động này?",
      buttons: [
        {
          label: "Có",
          onClick: () => action(projectId),
        },
        {
          label: "Không",
          onClick: () => {},
        },
      ],
    });
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
            onClick={() => confirmAction(handleApprove, params.id)}
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
            onClick={() => confirmAction(handleDecline, params.id)}
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
      <ToastContainer />
    </>
  );
};

export default ProjectRequest;
