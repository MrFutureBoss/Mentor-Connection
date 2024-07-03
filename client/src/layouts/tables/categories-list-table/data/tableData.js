// Material Dashboard 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

import MKBadge from "components/MKBadge";
import { useDispatch, useSelector } from "react-redux";
import getDate from "utilities/getDate";
import { setActivePopup } from "app/slices/activeSlice";
import { setCategory } from "app/slices/categorySlice";

export default function data() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.category.categories);
  const isActivePopup = (actions) => dispatch(setActivePopup(actions));
  const checkStatus = (status) => {
    if (status === "Active") {
      return "success";
    } else if (status === "InActive") {
      return "warning";
    } else {
      return "danger";
    }
  };

  const rows = data?.map((c) => ({
    code: (
      <MKTypography component="div" variant="caption" color="text" fontWeight="medium">
        {c._id}
      </MKTypography>
    ),
    name: (
      <MKTypography component="div" variant="caption" color="text" fontWeight="medium">
        {c.name}
      </MKTypography>
    ),
    status: (
      <MKBox ml={-1}>
        <MKBadge
          badgeContent={c.status}
          color={checkStatus(c.status)}
          variant="gradient"
          size="sm"
        />
      </MKBox>
    ),
    createdAt: (
      <MKTypography component="span" variant="caption" color="text" fontWeight="medium">
        {getDate(c.createdAt)}
      </MKTypography>
    ),
    updatedAt: (
      <MKTypography component="span" variant="caption" color="text" fontWeight="medium">
        {getDate(c.updatedAt)}
      </MKTypography>
    ),
    action: (
      <MKBox display="flex" gap="0.5rem">
        <MKTypography
          onClick={() => {
            isActivePopup({ type: "update", payload: "category" });
            dispatch(setCategory(c));
          }}
          component="span"
          variant="caption"
          color="text"
          fontWeight="medium"
          sx={{
            cursor: "pointer",
            "&:hover": {
              color: "#000000",
            },
          }}
        >
          Sửa
        </MKTypography>
      </MKBox>
    ),
  }));

  return {
    columns: [
      { Header: "mã", accessor: "code", align: "center" },
      { Header: "tên lĩnh vực", accessor: "name", align: "left" },
      {
        Header: "trạng thái",
        accessor: "status",
        align: "center",
      },
      {
        Header: "ngày tạo",
        accessor: "createdAt",
        align: "center",
      },
      {
        Header: "ngày cập nhật",
        accessor: "updatedAt",
        align: "center",
      },
      { Header: "hành động", accessor: "action", align: "center" },
    ],

    rows: rows,
  };
}
