import React, { Component } from 'react';
import http from 'axios';
import './styles/css/gui.css';
import './styles/css/bootstrap.css';
import logo from './images/DangerNoodleLogo.png';
import loading from './images/loading.svg';

class App extends Component {
  state = {
    code: '',
    numberOfLines: 1,
    scroll: 0,
    lexicalAnalyzer: [],
    error: [],
    loadingVisibility: false,
  };

  handleChange = (e) => {
    let code = { ...this.state.code };
    code = e.currentTarget.value;

    let lines = code.split(/\r|\r\n|\n/);
    // console.log(lines.length);

    this.setState({ code, numberOfLines: lines.length });
  };

  runLexicalAnalyzer = async (e) => {
    e.preventDefault();

    this.setState({ loadingVisibility: true });

    let code = this.state.code;
    const apiEndpoint = 'http://localhost:5000/playground/lexical-analyzer/';
    let result;

    try {
      result = await http.post(apiEndpoint, code);
      console.log(result.data);
      console.log('Success');
    } catch (ex) {
      console.log(ex);
      console.log('Error');
      this.setState({
        lexicalAnalyzer: [],
        error: ['Internal Server Error occured!'],
        loadingVisibility: false,
      });

      return 0;
    }

    let objData = result.data;
    console.log(objData);

    this.setState({
      lexicalAnalyzer: objData.token_list,
      error: objData.errors,
      loadingVisibility: false,
    });
  };

  runSyntaxAnalyzer = async (e) => {
    e.preventDefault();

    this.setState({ loadingVisibility: true });

    let code = this.state.code;
    const apiEndpoint = 'http://localhost:5000/playground/syntax-analyzer/';
    let result;

    try {
      result = await http.post(apiEndpoint, code);
      console.log(result.data);
      console.log('Success');
    } catch (ex) {
      console.log(ex);
      console.log('Error');
      this.setState({
        lexicalAnalyzer: [],
        error: ['Internal Server Error occured!'],
        loadingVisibility: false,
      });

      return 0;
    }

    let objData = result.data;
    console.log(objData);

    this.setState({
      lexicalAnalyzer: [],
      error: objData.syntax_error[0]
        ? [`Error: ${objData.syntax_error[0]}`]
        : ['The code is syntactically correct!'],
      loadingVisibility: false,
    });
  };

  renderLexicalTable = () => {
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">&nbsp;</th>
            <th scope="col">Lexeme</th>
            <th scope="col">Token</th>
          </tr>
        </thead>
        <tbody>
          {this.state.lexicalAnalyzer.map((item, index) => {
            return (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{item.lexeme.replace('\\\\', '\\')}</td>
                <td>{item.token}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  render() {
    let theCodeEditor = React.createRef();
    let theLineNumbers = React.createRef();
    let scroll = 0;

    const viewScrollProgress = () => {
      try {
        scroll = theCodeEditor.current.scrollTop;
        this.setState({ scroll });
        // console.log(theLineNumbers.current.scrollTop);
        theLineNumbers.current.scrollTop = scroll;
      } catch (ex) {
        // console.log('Catch.')
      }
    };

    return (
      <div className="App">
        <img src={logo} alt="Danger Noodle Logo" />
        <span>DangerNoodle</span>
        <span className="loading">
          <img
            style={{
              visibility: this.state.loadingVisibility ? 'visible' : 'hidden',
            }}
            src={loading}
            alt="Danger Noodle Logo"
          />
        </span>

        <div className="container">
          <div className="left-side">
            <form>
              <div className="code-editor">
                <div
                  className="line-numbers"
                  ref={theLineNumbers}
                  onScroll={viewScrollProgress}
                >
                  {[...Array(this.state.numberOfLines)].map((item, index) => (
                    <>
                      {`${index + 1}`}
                      <br />
                    </>
                  ))}
                </div>

                <textarea
                  ref={theCodeEditor}
                  onScroll={viewScrollProgress}
                  value={this.state.code}
                  onChange={this.handleChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab' && !e.shiftKey) {
                      document.execCommand('insertText', false, '\t');
                      e.preventDefault();
                    }
                  }}
                />
              </div>

              <br />
              <button
                className="btn btn-primary"
                onClick={(e) => this.runLexicalAnalyzer(e)}
              >
                Run Lexical Analyzer
              </button>

              <button
                className="btn btn-primary"
                onClick={(e) => this.runSyntaxAnalyzer(e)}
              >
                Run Syntax Analyzer
              </button>
            </form>

            <div className="error-displayer">
              {this.state.error.map((item, index) => (
                <p key={index}>{item}</p>
              ))}
            </div>
          </div>

          <div className="right-side">{this.renderLexicalTable()}</div>
        </div>
      </div>
    );
  }
}

export default App;
