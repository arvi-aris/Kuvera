import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

injectTapEventPlugin();
import { green100, green500, green700 } from 'material-ui/styles/colors';
const styles = {
    bodyPadd: {
     margin:0
    }
};

class Home extends React.Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div  inputStyle={styles.bodyPadd}> hi </div>
      </MuiThemeProvider>
    );
  }
}
window.__myapp_container = document.getElementById('app')
ReactDOM.render(<Home />, document.getElementById('app'));