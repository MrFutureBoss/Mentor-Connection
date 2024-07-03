import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import MKBox from "components/MKBox";
import DefaultCounterCard from "examples/Cards/CounterCards/DefaultCounterCard";
import { useSelector } from "react-redux";

function Counters() {
  const { teacher, mentor, student } = useSelector((state) => state.user.pmtUser);

  return (
    <MKBox component="section" py={3}>
      <Container>
        <Grid container item xs={12} lg={9} sx={{ mx: "auto" }}>
          <Grid item xs={12} md={4}>
            <DefaultCounterCard
              count={teacher ?? 0}
              suffix="+"
              title="Giáo viên"
              description="Số lượng giáo viên trong hệ thống"
            />
          </Grid>
          <Grid item xs={12} md={4} display="flex">
            <Divider orientation="vertical" sx={{ display: { xs: "none", md: "block" }, mx: 0 }} />
            <DefaultCounterCard
              count={mentor ?? 0}
              suffix="+"
              title="Hướng dẫn viên"
              description="Số lượng hướng dẫn viên có trong hệ thống"
            />
            <Divider orientation="vertical" sx={{ display: { xs: "none", md: "block" }, ml: 0 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <DefaultCounterCard
              count={student ?? 0}
              suffix="+"
              title="Học sinh"
              description="Số lượng học sinh có trong hệ thống"
            />
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Counters;
