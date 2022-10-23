class Form extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.title}
        <p>Current Action: /{this.props.action}</p>
        <form
          method="POST"
          action={"http://localhost:3000/user/" + this.props.action}
        >
          <label>Username: </label>
          <input type="text" name="name" required></input>
          <label>Password: </label>
          <input type="password" name="password" required></input>
          {this.props.action === "register-user" ? (
            <>
              <label>Phone Number: </label>
              <input type="number" name="phone_number" required></input>
            </>
          ) : null}
          <input type="submit"></input>
          {this.props.change_button}
        </form>
      </React.Fragment>
    );
  }
}

class BucketForm extends React.Component {
  state = { users: {}, decisionMade: false, isadmin: false };
  componentDidMount() {
    fetch("http://localhost:3000/user/get-all-details", {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
      },
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        this.setState({ users: data });
      });
    
    fetch(`http://localhost:3000/user/check-user/${this.props.username}`)
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        this.setState({
          decisionMade: data.decisionMade,
          isadmin: data.isadmin,
        });
      });
  }

  render() {
    return (
      <React.Fragment>
        <h1>
          Welcome <br></br> {decodeURIComponent(this.props.username)}
        </h1>
        {this.state.isadmin === true ? (
          <form>
            <button
              type="submit"
              formaction={"http://localhost:3000/admin/send_message"}
              value="Send Messages"
              formMethod="post"
            >
              Send Messages
            </button>
            <button
              type="submit"
              value="Logout"
              formaction={"http://localhost:3000/user/logout"}
              formMethod="post"
            >
              Logout
            </button>
          </form>
        ) : (
          <>
            <h2>BreakFast Opt-in: {this.state.users.breakfast}</h2>
            <h2>Snacks Opt-in: {this.state.users.snacks}</h2>
            <form>
              {this.state.decisionMade === false ? (
                <>
                  <label>BreakFast</label>
                  <input type="checkbox" name="opt" value="breakfast"></input>
                  <br></br>
                  <label>Snacks</label>
                  <input type="checkbox" name="opt" value="snacks"></input>
                  <button
                    type="submit"
                    formaction={"http://localhost:3000/user/submit-vote"}
                    value="Submit"
                    formMethod="post"
                  >
                    Submit
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="submit"
                    value="Logout"
                    formaction={"http://localhost:3000/user/logout"}
                    formMethod="post"
                  >
                    Logout
                  </button>
                  <h2>
                    Please wait for message as you already have made your
                    decision.
                  </h2>
                </>
              )}
            </form>
          </>
        )}
      </React.Fragment>
    );
  }
}

class App extends React.Component {
  state = { view: true, userlogin: null };
  handleClick = () => {
    this.setState(() => ({
      view: !this.state.view,
    }));
  };
  render() {
    return document.cookie.length === 0 ? (
      <div>
        <Form
          action={this.state.view ? "register-user" : "login-user"}
          title={<h1>{this.state.view ? "RegisterPage" : "LoginPage"}</h1>}
          change_button={
            <a href="#" onClick={this.handleClick}>
              Go to {this.state.view ? "Login" : "Signup"} Page
            </a>
          }
        ></Form>
      </div>
    ) : (
      <BucketForm username={document.cookie.split("=")[1]}></BucketForm>
    );
  }
}

ReactDOM.render(<App></App>, document.getElementById("root"));
