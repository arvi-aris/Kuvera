import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import KuveraHome from './components/kuveraHome.jsx'
injectTapEventPlugin();

class Home extends React.Component {
  render() {
    return (
      <MuiThemeProvider >
        <KuveraHome />
      </MuiThemeProvider>
    );
  }
}
window.__myapp_container = document.getElementById('app')
ReactDOM.render(<Home />, document.getElementById('app'));