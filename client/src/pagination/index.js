import { setPageNo } from "app/slices/utilitiesSlice";
import MKBox from "components/MKBox";
import PropTypes from "prop-types";
import MKPagination from "components/MKPagination";
import { useDispatch } from "react-redux";
import { Icon } from "@mui/material";

function Pagination({ pageNo, qttPage }) {
  console.log(pageNo, qttPage - 4 >= pageNo + 1 ? pageNo + 1 : qttPage - 4);
  const dispatch = useDispatch();
  return (
    <MKBox
      position="absolute"
      display="flex"
      gap="0.5rem"
      sx={{
        left: "50%",
        transform: "translateX(-50%)",
        bottom: "6px",
        overflow: "auto",
      }}
    >
      <MKPagination item onClick={() => pageNo > 0 && dispatch(setPageNo(pageNo - 1))}>
        <Icon>keyboard_arrow_left</Icon>
      </MKPagination>
      {qttPage < 10 ? (
        Array.from({ length: qttPage }, (_, index) => (
          <MKPagination key={index}>
            <MKPagination active={index === pageNo} onClick={() => dispatch(setPageNo(index))} item>
              {index + 1}
            </MKPagination>
          </MKPagination>
        ))
      ) : (
        <>
          <MKPagination>
            <MKPagination
              active={qttPage - 4 >= pageNo}
              onClick={() =>
                dispatch(setPageNo(qttPage - 4 >= pageNo + 1 ? pageNo + 1 : qttPage - 4))
              }
              item
            >
              {qttPage - 3 >= pageNo + 1 ? pageNo + 1 : qttPage - 3}
            </MKPagination>
          </MKPagination>
          <MKPagination>
            <MKPagination
              active={qttPage - 3 === pageNo}
              onClick={() =>
                dispatch(setPageNo(qttPage - 3 >= pageNo + 2 ? pageNo + 1 : qttPage - 3))
              }
              item
            >
              {qttPage - 2 >= pageNo + 2 ? pageNo + 2 : qttPage - 2}
            </MKPagination>
          </MKPagination>
          <MKPagination>
            <MKPagination item>...</MKPagination>
          </MKPagination>
          <MKPagination>
            <MKPagination
              active={qttPage - 2 === pageNo}
              onClick={() => dispatch(setPageNo(qttPage - 2))}
              item
            >
              {qttPage - 1}
            </MKPagination>
          </MKPagination>
          <MKPagination>
            <MKPagination
              active={qttPage - 1 === pageNo}
              onClick={() => dispatch(setPageNo(qttPage - 1))}
              item
            >
              {qttPage}
            </MKPagination>
          </MKPagination>
        </>
      )}
      <MKPagination item onClick={() => qttPage - 1 > pageNo && dispatch(setPageNo(pageNo + 1))}>
        <Icon>keyboard_arrow_right</Icon>
      </MKPagination>
    </MKBox>
  );
}

Pagination.defaultProps = {
  qttPage: 0,
  pageNo: 1,
};
Pagination.propTypes = {
  qttPage: PropTypes.number,
  pageNo: PropTypes.number,
};

export default Pagination;
