import { useEffect } from "react";
import {
  setActivePopupCreateGroupFromExcel,
  setActivePopupCreateGroup,
} from "app/slices/activeSlice";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import Tables from "layouts/tables/user-list-table";
import CreateGroupModal from "layouts/sections/featuers/components/FeaturesOne/CreateGroupRandomModal";
import CreateGroupFromExcelPopup from "layouts/sections/featuers/components/CreateGroupUpFileModal";
import { setClassId } from "app/slices/classOnerTeacherSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import getParams from "utilities/getParams";
import ExcelJS from "exceljs";
import saveAs from "file-saver";

const ListOfStudent = () => {
  const dispatch = useDispatch();
  const url = useLocation();
  const classId = getParams(3, url.pathname);
  const { class: classObj } = useSelector((state) => state.class);
  const { active_create_group, active_create_group_excel } = useSelector((state) => state.active);
  const { data: classStudent } = useSelector((state) => state.user.users);
  const { groups } = useSelector((state) => state.group);

  const handleRandomGroup = () => {
    dispatch(setActivePopupCreateGroup(true));
  };
  const handleExcelGroup = () => {
    dispatch(setActivePopupCreateGroupFromExcel(true));
  };

  useEffect(() => {
    if (classId) {
      dispatch(setClassId(classId));
    }
  }, [classId, dispatch]);

  const handleExportExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("template");
    const columnNames = [
      "TeacherName",
      "TeacherEmail",
      "ClassName",
      "Email",
      "MemberCode",
      "RollNumber",
      "FullName",
      "Gender",
      "GroupNo",
      "Leader",
      "ProjectName",
    ];
    worksheet.addRow(columnNames);
    classStudent?.forEach((row) => {
      const { email, memberCode, rollNumber, username, gender } = row;
      worksheet.addRow([
        classObj?.[0]?.teacherId?.username,
        classObj?.[0]?.teacherId?.email,
        classObj?.[0]?.className,
        email,
        memberCode,
        rollNumber,
        username,
        gender ? "nam" : "nữ",
      ]);
    });
    columnNames.forEach((header, index) => {
      const column = worksheet.getColumn(index + 1);
      column.eachCell((cell) => {
        const length = String(cell.value).length;
        column.width = Math.max(column.width || 0, length + 2);
      });
    });
    const fileName = "template.xlsx";
    workbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(new Blob([buffer], { type: "application/octet-stream" }), fileName);
    });
  };
  return (
    <>
      {groups?.length === 0 && (
        <MKBox px={"14px"} my={1} display="flex" justifyContent="end" gap="1.5rem">
          <MKButton onClick={handleExportExcel}>Tải file</MKButton>
          <MKButton onClick={handleRandomGroup}>Tạo Nhóm Ngẫu Nhiên</MKButton>
          <MKButton onClick={handleExcelGroup}>Tạo Nhóm Bằng Excel</MKButton>
        </MKBox>
      )}
      {active_create_group && <CreateGroupModal />}
      {active_create_group_excel && <CreateGroupFromExcelPopup />}
      <Tables />
    </>
  );
};

export default ListOfStudent;
