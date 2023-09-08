import ClientFirebaseConnection from "../firebase/ClientFirebaseConnection"

export const onSubmitLoginForm = (e: any)=>{
    e.preventDefault()

    // Grab form data
    let email = (<HTMLInputElement>document.getElementById("login-email")).value
    let password = (<HTMLInputElement>document.getElementById("login-password")).value

    ClientFirebaseConnection.getConnection().login(email, password)
        .then(()=>{
            (<HTMLInputElement>document.getElementById("login-email")).value = "";
            (<HTMLInputElement>document.getElementById("login-password")).value = "";
        })
        .catch((e)=>{
            alert(e.message)
        })
}

export const onSubmitRegisterForm = (e: any)=>{
    e.preventDefault()

    // Grab form data
    let username = (<HTMLInputElement>document.getElementById("signup-username")).value
    let email = (<HTMLInputElement>document.getElementById("signup-email")).value
    let password = (<HTMLInputElement>document.getElementById("signup-password")).value
    let confirmPassword = (<HTMLInputElement>document.getElementById("signup-confirm-password")).value
    if(password === confirmPassword){
        ClientFirebaseConnection.getConnection().signup(email, username, password)
            .then(()=>{
                (<HTMLInputElement>document.getElementById("signup-username")).value = "";
                (<HTMLInputElement>document.getElementById("signup-email")).value = "";
                (<HTMLInputElement>document.getElementById("signup-password")).value = "";
                (<HTMLInputElement>document.getElementById("signup-confirm-password")).value = "";
            })
            .catch((e)=>{
                alert(e.message)
            })
    }else{
        alert("Passwords must match!")
    }
}

let showLogin = true

/** Changes form to type to login/register based on current state */
export const toggleForm = (e: any, toggle?: any)=>{
    if(toggle) showLogin = toggle;
    else showLogin = !showLogin;

    // (<HTMLInputElement>document.getElementById("loginForm")).classList.add(showLogin? "visible" : "");
    // (<HTMLInputElement>document.getElementById("signupForm")).classList.add(showLogin? "" : "visible");
    (<HTMLInputElement>document.getElementById("loginForm")).style.display = (showLogin? "block" : "none");
    (<HTMLInputElement>document.getElementById("signupForm")).style.display = (showLogin? "none" : "block");
}