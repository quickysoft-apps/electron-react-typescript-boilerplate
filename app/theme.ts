import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import * as Colors from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator'

const getTheme = () => {
  let overwrites = {
    "palette": {
      //"primary1Color": Colors.blueGrey400,
      "canvasColor": fade(Colors.faintBlack, 0.12)
    },
    "appBar": {
      "height": 50
    }
  };
  return getMuiTheme(baseTheme, overwrites);
}

export default getTheme;