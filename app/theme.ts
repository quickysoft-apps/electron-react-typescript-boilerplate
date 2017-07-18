import { grey800 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const muiTheme = getMuiTheme({
  flatButton: {
    "disabledTextColor": "rgba(255, 255, 255, 0.54)"
  },
  appBar: {
    height: 50,
    color: grey800
  }
});

export default muiTheme;