import ClientFirebaseConnection from "../firebase/ClientFirebaseConnection"

export const onSubmitLoginForm = (e: any)=>{
    e.preventDefault()

    // Grab form data
    let email = (<HTMLInputElement>document.getElementById("login-email")).value
    let password = (<HTMLInputElement>document.getElementById("login-password")).value

    ClientFirebaseConnection.getConnection().login(email, password)
        .then(()=>{
            document.getElementById("loginForm")?.setAttribute("display", "none")
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
                document.getElementById("signupForm")?.setAttribute("display", "none")
            })
            .catch((e)=>{
                alert(e.message)
            })
    }else{
        alert("Passwords must match!")
    }
}