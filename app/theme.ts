import darkBaseTheme from  'material-ui/styles/baseThemes/darkBaseTheme';

import { grey800 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
const merge = require('lodash.merge');

const muiTheme = {  
  appBar: {
    height: 50,
    color: grey800
  }
};

const theme = getMuiTheme(merge(darkBaseTheme, muiTheme))

export default theme;