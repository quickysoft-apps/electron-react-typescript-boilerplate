import { grey800 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const muiTheme = getMuiTheme({  
  palette: {
    disabledColor: "#424242"
  },
  appBar: {
    height: 50,
    color: grey800
  }
});

export default muiTheme;