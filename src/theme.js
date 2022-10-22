import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  // shadows: [
  //   // 'none',
  //   '0px 15px 60px rgba(0, 0, 0, 0.25)',
  //   '0px 35px 60px rgba(0, 0, 0, 0.25)',
  //   // '20px 55px 60px rgba(0, 0, 0, 0.25)',
  //   // '10px 15px 60px rgba(0, 0, 0, 0.25)',
  // ],
  palette: {
    primary: {
      main: '#4361ee',
    },
  },
  typography: {
    button: {
      textTransform: 'none',
      fontWeight: 400,
    },
  },
})
