import React, { Component } from "react";
import http from "axios";
import "./styles/css/gui.css";
import "./styles/css/bootstrap.css";
import logo from "./images/DangerNoodleLogo.png";
import loading from "./images/loading.svg";

class App extends Component {
  state = {
    code: "",
    lexicalAnalyzer: [],
    lexicalError: "",
    loadingVisibility: false
  };

  handleChange = (e) => {
    let code = { ...this.state.code };
    code = e.currentTarget.value;

    this.setState({ code });
  };

  submitCode = async (e) => {
    e.preventDefault();

    this.setState({ loadingVisibility: true });
    
    let code = this.state.code;
    // code = `head
    //     var numb x = 0, y = 0, product = 0; 
    //   spit(||Enter the first number: ||); 
    //   swallow(x); 
    
    //   spit(||Enter the second number: ||); 
    //   swallow(y); 
      
    //   product = multiply(x, y); 
    //   spit(||The product is: ||, product); 
    // tail 
    
    // numb action multiply(numb n1, numb n2) { 
    //   return n1 * n2; 
    // }`;
    console.log(typeof code);
    const apiEndpoint = "http://localhost:5000/playground/lexical-analyzer/";
    let result = await http.post(apiEndpoint, code);
    console.log(result.data);

    if (result.data.indexOf("Cannot") >= 0) {
      this.setState({ 
        lexicalAnalyzer: [],
        lexicalError: result.data, 
        loadingVisibility: false 
      });
      return 0;
    }
    

    let objData = result.data.replace(/'/g, `"`);
    console.log(objData);

    objData = objData.replace(": ", ":");
    objData = objData.replace(/,/g, ", ");
    //console.log(objData);
    objData = objData.replace(/}{/g, `}, {`);
    //console.log(objData);
    objData = objData.split("}, {");
    objData.pop();
    //console.log(objData);

    let newObjData = [];

    objData.map((item, index) =>
      index !== 0
        ? newObjData.push("{" + item + "}")
        : newObjData.push(item + "}")
    );
    //console.log(newObjData);

    let finalObjData = [];
    // newObjData.map((item) => console.log(JSON.parse(item)));
    newObjData.map((item) => finalObjData.push(JSON.parse(item)));

    console.log(finalObjData);
    this.setState({ lexicalAnalyzer: finalObjData, loadingVisibility: false });
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
                <td>{item.lexeme}</td>
                <td>{item.token}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  render() {
    return (
      <div className="App">
        <img src={logo} alt="Danger Noodle Logo"/>
        <span>DangerNoodle</span>
        <span className="loading"><img style={{visibility: this.state.loadingVisibility ? 'visible' : 'hidden'}} src={loading} alt="Danger Noodle Logo"/></span>

        <div className="container">
          <div className="left-side">
            <form onSubmit={this.submitCode}>
              <textarea
                value={this.state.code}
                onChange={this.handleChange}
                onKeyDown={e => {
                  if ( e.key === 'Tab' && !e.shiftKey ) {
                    document.execCommand('insertText', false, "\t");
                    e.preventDefault();
                  }
                }}
              ></textarea>
              <br />
              <input type="submit" id="submit-btn" value="Submit" className="btn btn-primary"/>
            </form>

            <div className="error-displayer">
              <p>{this.state.lexicalError}</p>
            </div>
          </div>

          <div className="right-side">
            { this.renderLexicalTable() }
          </div>
          
        </div>
      </div>
    );
  }
}

export default App;
