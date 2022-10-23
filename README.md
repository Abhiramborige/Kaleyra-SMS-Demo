## Kaleyra SMS API Prototype Demonstration.

### Functionalities:

1. Login/Signup.
2. User can choose what he/she will consume (breakfast/snacks/both)
3. Admin can send message to all the users on whether what he/she has chosen (breakfast/snacks/both). In this way, the food wastage is minimized and attendance can be smoothly proceeded.

### SMS format:

```js
`Greetings ${ele.username} from Kalyera. You have opted for ${
  ele.needBreakfast ? "Breakfast" : ""
} and ${ele.needSnacks ? "Snacks" : ""}`;
```

### User schema:

```js
{
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phonenumber:{
    type: String,
    required: true,
  },
  isadmin:{
    type: Boolean,
    required: true
  },
  needBreakfast:{
    type: Boolean,
    required: true,
  },
  needSnacks:{
    type: Boolean,
    required: true,
  },
  decisionMade:{
    type: Boolean,
    required: true
  }
}
```

### ENV structure:

USERNAME_APP="Username of mongo cluster"
PASSWORD_APP="Password of mongo cluster"
FRONT_END_URL=http://localhost:5500/public
taskapi="API Key support of Kaleyra"
SID="SID Key support of Kaleyra account"
secret="JWT secret"

---

### To run the project:

```
git clone https://github.com/Abhiramborige/Kaleyra-SMS-Demo.git
cd Kaleyra-SMS-Demo
npm install // to install dependencies
npm start // to start the express-mongo server
Open "index.html" using live server from VS Code.
```

### React CDNs are used instead of package dependencies as this project mainly focusses on backed.

### This project was made as part of the recruitment - "Kaleyra - Software Developer"
