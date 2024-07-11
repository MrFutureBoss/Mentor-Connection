// @mui material components
import Icon from "@mui/material/Icon";

// Pages
import AboutUs from "layouts/pages/landing-pages/about-us";
import ContactUs from "layouts/pages/landing-pages/contact-us";
import Author from "layouts/pages/landing-pages/author";
import ListAccountBase from "layouts/admin/add-list-account";
import AddListClassBase from "layouts/admin/add-list-class";
import TeacherFunction from "layouts/sections/featuers";
import DashboardAdmin from "layouts/admin/dashboard";
import SemesterAdmin from "layouts/admin/semester";
import { useDispatch, useSelector } from "react-redux";
import GroupDetail from "layouts/user/students";
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "utilities/initialValue";
import { setUserLogin } from "app/slices/userSlice";
import { setAllGroup } from "app/slices/groupSlice";
import { setClassList } from "app/slices/classSlice";
import GroupsAdmin from "layouts/admin/list-groups";
import CategoriesAdmin from "layouts/admin/list-categories";
import { setLimit } from "app/slices/utilitiesSlice";
import ListGroups from "layouts/sections/featuers/components/FeaturesOne/viewListGroups";
import Mentor from "layouts/user/mentor";
import { setMentorGroups } from "app/slices/mentorSlice";
import GroupsMatchedAdmin from "layouts/admin/list-groups-matched";
import TeacherAccep from "layouts/user/teacher";

function Routes() {
  const dispatch = useDispatch();
  const { classList } = useSelector((state) => state.class);
  const { userLogin } = useSelector((state) => state.user);
  const groups = useSelector((state) => state.mentor.mentorGroups);
  const { data: allGroups } = useSelector((state) => state.group.allGroups);
  const { pageNo, limit } = useSelector((state) => state.utilities);
  const skip = pageNo * limit;
  const jwt = localStorage.getItem("jwt");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  useEffect(() => {
    dispatch(setLimit(12));
    if (jwt)
      axios
        .get(BASE_URL + "/user/profile", config)
        .then((res) => dispatch(setUserLogin(res.data)))
        .catch((err) => console.log(err.message));
  }, [dispatch]);
  useEffect(() => {
    if (userLogin?._id && jwt) {
      axios
        .get(`${BASE_URL}/class/${userLogin?._id}/user`, config)
        .then((res) => dispatch(setClassList(res.data)))
        .catch((err) => console.log(err.message));
    }
  }, [userLogin, dispatch]);
  useEffect(() => {
    if (userLogin.role === 2 && jwt)
      axios
        .get(`${BASE_URL}/teacher/${userLogin?._id}/groups?skip=${skip}`, config)
        .then((res) => dispatch(setAllGroup(res.data)))
        .catch((err) => console.log(err));
  }, [userLogin, dispatch, pageNo, limit]);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/mentor/mentor_groups`, config)
      .then((response) => {
        dispatch(setMentorGroups(response.data));
      })
      .catch((err) => console.log("Error fetching mentor groups:", err));
  }, [dispatch]);
  let result = [
    {
      name: "Trang",
      icon: <Icon>dashboard</Icon>,
      columns: 1,
      rowsPerColumn: 2,
      collapse: [
        {
          name: "Thông tin",
          collapse: [
            {
              name: "about us",
              route: "/pages/landing-pages/about-us",
              component: <AboutUs />,
            },
            {
              name: "contact us",
              route: "/pages/landing-pages/contact-us",
              component: <ContactUs />,
            },
            {
              name: "Tài khoản",
              route: "/pages/landing-pages/author",
              component: <Author />,
            },
          ],
        },
      ],
    },
  ];
  if (classList?.length > 0 && userLogin?._id) {
    result.push({
      name: "Lớp Học",
      dropdown: true,
      icon: <Icon>article</Icon>,
      columns: 1,
      rowsPerColumn: 2,
      collapse: [
        {
          name: "Lớp của bạn",
          collapse: classList?.map((c) => ({
            name: c.className,
            route: "/presentation/class/" + c._id,
            component: <TeacherFunction />,
          })),
        },
      ],
    });
  }
  if (userLogin?.groupId?.[0]?._id && userLogin?.role === 4) {
    result.push({
      name: "Nhóm",
      dropdown: false,
      route: `/group/${userLogin?.groupId?.[0]?._id}/members`,
      component: <GroupDetail />,
    });
  }
  if (userLogin?.role === 3 && groups?.length > 0) {
    result.push({
      name: "Nhóm",
      dropdown: false,
      route: `/mentor/groups`,
      component: <Mentor />,
    });
  }
  if (userLogin?.role === 2 && allGroups?.length > 0) {
    result.push({
      name: "Chức năng",
      dropdown: true,
      icon: <Icon>apps</Icon>,
      description: "Chức năng",
      collapse: [
        { name: "Ghép Mentor", route: `/presentation/groups`, component: <ListGroups /> },
        {
          name: "Duyệt dự án",
          route: `/presentation/request/groups`,
          component: <TeacherAccep />,
        },
      ],
    });
  }
  if (userLogin?.role === 1) {
    result.push({
      name: "Quản lý",
      dropdown: true,
      icon: <Icon>article</Icon>,
      description: "Xem tất cả",
      collapse: [
        {
          name: "Thống Kê",
          route: "/admin/dashboard",
          component: <DashboardAdmin />,
        },
        {
          name: "Kỳ học",
          route: "/admin/semester",
          component: <SemesterAdmin />,
        },
        {
          name: "Danh Sách Người Dùng",
          route: "/admin/list-accounts",
          component: <ListAccountBase />,
        },
        {
          name: "Danh Sách Lớp Học",
          route: "/admin/list-classes",
          component: <AddListClassBase />,
        },
        {
          name: "Danh Sách Các Nhóm",
          route: "/admin/list-groups",
          component: <GroupsAdmin />,
        },
        {
          name: "Danh Sách Các Lĩnh Vực",
          route: "/admin/list-categories",
          component: <CategoriesAdmin />,
        },
        {
          name: "Danh Sách Các Nhóm Đã Ghép Mentor",
          route: "/admin/list-matcheds",
          component: <GroupsMatchedAdmin />,
        },
      ],
    });
  }
  return result;
}
export default Routes;
