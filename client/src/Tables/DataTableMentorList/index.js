import { useMemo } from "react";
import PropTypes from "prop-types";
import { useTable, usePagination, useGlobalFilter, useSortBy } from "react-table";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

import MKBox from "components/MKBox";
import MKInput from "components/MKInput";

import DataTableHeadCell from "Tables/DataTableHeadCell";
import DataTableBodyCell from "Tables/DataTableBodyCell";
import { useDispatch, useSelector } from "react-redux";
import MKButton from "components/MKButton";
import axios from "axios";
import { BASE_URL } from "utilities/initialValue";
import { setActivePopup } from "app/slices/activeSlice";
import { setGroups } from "app/slices/groupSlice";
import Pagination from "pagination";
import { setMentorChoice } from "app/slices/temporaryMatching";
import { setSearch } from "app/slices/utilitiesSlice";
import MKTypography from "components/MKTypography";

function DataTable({ table, isSorted, noEndBorder }) {
  const { data: listTemporaryMaching, total } = useSelector(
    (state) => state.temporaryMatching.temporaryMatching
  );
  const { group } = useSelector((state) => state.group);
  const { mentorChoice } = useSelector((state) => state.temporaryMatching);
  const { pageNo, limit } = useSelector((state) => state.utilities);
  const { classId } = useSelector((state) => state.classOnerTeacher);
  let qttPage = total ? Math.ceil(total / limit) : 0;
  const columns = useMemo(() => table.columns, [table]);
  const data = useMemo(() => table.rows, [table]);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
  };
  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: 0 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows, page } = tableInstance;
  const handleChoiceMentor = () => {
    if (mentorChoice?._id && group?._id) {
      axios
        .post(`${BASE_URL}/matched`, { mentorId: mentorChoice?._id, groupId: group?._id }, config)
        .then(() =>
          axios
            .get(`${BASE_URL}/group/${classId}/groups`, config)
            .then((res) => dispatch(setGroups(res.data)))
            .catch((error) => console.log(error.message))
        )
        .catch((err) => console.log(err.message));

      dispatch(setActivePopup(false));
      dispatch(setMentorChoice({}));
    }
  };
  return (
    <TableContainer
      sx={{ boxShadow: "none", overflowX: "unset", paddingBottom: "3rem", position: "relative" }}
    >
      <MKBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={3}
        sx={{ gap: "0.5rem" }}
      >
        <MKBox>
          <MKButton
            variant="gradient"
            color="info"
            size="small"
            disabled={!mentorChoice._id}
            onClick={handleChoiceMentor}
          >
            Lưu
          </MKButton>
        </MKBox>
        <MKBox width="16rem" ml="auto">
          <MKInput
            placeholder="Search email..."
            size="small"
            fullWidth
            onChange={({ currentTarget }) => dispatch(setSearch(currentTarget.value))}
          />
        </MKBox>
      </MKBox>
      <Table {...getTableProps()}>
        <MKBox component="thead">
          {headerGroups.map((headerGroup, key) => (
            <TableRow key={key} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, idx) => (
                <DataTableHeadCell
                  key={idx}
                  {...column.getHeaderProps(isSorted && column.getSortByToggleProps())}
                  width={column.width ? column.width : "auto"}
                  align={column.align ? column.align : "left"}
                  sx={{ overflowWrap: "break-word", wordWrap: "break-word" }}
                >
                  {column.render("Header")}
                </DataTableHeadCell>
              ))}
            </TableRow>
          ))}
        </MKBox>
        <TableBody {...getTableBodyProps()}>
          {page.map((row, key) => {
            prepareRow(row);
            return (
              <TableRow
                onClick={() => dispatch(setMentorChoice(listTemporaryMaching[key]))}
                key={key}
                {...row.getRowProps()}
                sx={{ cursor: "pointer" }}
              >
                {row.cells.map((cell, idx) => (
                  <DataTableBodyCell
                    key={idx}
                    noBorder={noEndBorder && rows.length - 1 === key}
                    align={cell.column.align ? cell.column.align : "left"}
                    width={cell.column.width ? cell.column.width : "auto"}
                    {...cell.getCellProps()}
                  >
                    {cell.render("Cell")}
                  </DataTableBodyCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {qttPage > 1 && <Pagination pageNo={pageNo} qttPage={qttPage} />}
      {rows.length === 0 && (
        <MKBox lineHeight={1} textAlign="center">
          <MKTypography
            mt="1rem"
            display="block"
            variant="caption"
            color="text"
            fontSize="1rem"
            fontWeight="medium"
          >
            Không có người dùng nào...
          </MKTypography>
        </MKBox>
      )}
    </TableContainer>
  );
}

// Setting default values for the props of DataTable
DataTable.defaultProps = {
  canSearch: false,
  showTotalEntries: true,
  pagination: { variant: "gradient", color: "info" },
  isSorted: true,
  noEndBorder: false,
};

// Typechecking props for the DataTable
DataTable.propTypes = {
  canSearch: PropTypes.bool,
  showTotalEntries: PropTypes.bool,
  table: PropTypes.objectOf(PropTypes.array).isRequired,
  pagination: PropTypes.shape({
    variant: PropTypes.oneOf(["contained", "gradient"]),
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
    ]),
  }),
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
};

export default DataTable;
