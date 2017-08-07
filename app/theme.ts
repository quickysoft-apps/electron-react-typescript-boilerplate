import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import * as Colors from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator'

document.body.style.position = "relative";
document.body.style.height = "100vh";
document.body.style.overflowY = "hidden";
document.body.style.color = fade(Colors.white, 0.87);
document.body.style.backgroundColor = fade(Colors.darkBlack, 0.87);
document.body.style.fontFamily = 'Roboto, sans-serif';
document.body.style.fontSize = '16px';
document.body.style.margin = "0px";

const getTheme = () => {
  let overwrites = {
    "palette": {
      //"primary1Color": Colors.blueGrey400,
      //"accent1Color": Colors.lightBlue800,
      //"canvasColor": fade(Colors.faintBlack, 0.12)
    },
    "appBar": {
      "height":60,
      "textColor": fade(Colors.darkWhite, 0.87),
      "color": Colors.grey800
    }
  };
  return getMuiTheme(baseTheme, overwrites);
}

export default getTheme;