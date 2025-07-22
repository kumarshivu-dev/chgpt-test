import * as React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

function getColor(value) {
  if (value < 30) {
    // return 'green'; // Less than 50, set to green
    return 'red'
  } else if (value >= 30 && value <= 79) {
    // Between 50 to 79, apply linear gradient from #FFB800 to #FF9100
    return '#ebac1e';
  } else if (value >= 80 && value <= 90) {
    // Between 80 to 90, apply linear gradient from #FFB800 to #FF5C00
    return 'orange';
  } else {
    // Between 91 to 100, apply linear gradient from #FF5C00 to #D30000
    return 'green';
  }
}

function CircularProgressWithLabel(props) {
  const color = getColor(props.value);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <div style={{
        position: "relative"
      }}>
      <CircularProgress variant="determinate" size={isMobile ? 70 : 150}  thickness={3} {...props} sx={{
        color: color,
          position: "relative",
          zIndex: 99
        }}/>
      <CircularProgress variant="determinate" size={isMobile ? 70 : 150}  thickness={3} value={100} sx={{
          position: "absolute",
          zIndex: 0,
          stroke: 'lightgray',
          color: "lightgray",
          top: 0,
          left: 0
        }}/>
      </div>
      {/* <CircularProgress variant="determinate" size={70} thickness={3} {...props} sx={{
          color: (theme) =>
          theme.palette.success.main[theme.palette.],
        }}/> */}
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: {xs:'70px', sm:'150px'}
        }}
      >
        <Typography variant="caption" component="div" color={color} sx={{fontSize:{xs:'16px',sm:'24px'}}}>
        {props.value===0 ? '0%' : (props.value>=100? '100%' :`${props.value.toFixed(1)}%`)}
        </Typography>
      </Box>
    </Box>
  );
}

export default function CircularWithValueLabel({progress}) {
  return <CircularProgressWithLabel value={progress} />;
}
