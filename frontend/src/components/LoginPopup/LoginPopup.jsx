import React from "react";
import "./LoginPopup.css";
import { useState } from "react";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios"


const LoginPopup = ({ setShowLogin }) => {
    const {url, setToken} = useContext(StoreContext)    
   
    const [currState, setCurrState] = useState("Login");
    const [data, setData] = useState({
        name: '',
        email: "",
        password: ""
    })

    const onChangeHandler = (event) =>{
        const name = event.target.name;
        const value = event.target.value
        setData(data=>({...data, [name]: value}))
    }

    const onLogin  = async (event) =>{
        event.preventDefault()
        let newUrl = url
        if(currState === "Login"){   // ✅ fixed case (was "login")
            newUrl += "/api/user/login"
        }else{
            newUrl += "/api/user/register"   // ✅ removed trailing spaces
        }

        const response = await axios.post(newUrl,data)
        if(response.data.success){
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token)

            setShowLogin(false)
        }else{
            alert(response.data.message)
        }
    }

    return (
        <div className="login-popup">
            <form onSubmit = {onLogin} action="" className= "login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img
                        onClick={() => setShowLogin(false)}
                        src={assets.cross_icon}
                        alt=""
                    />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Login" ? (
                        <></>
                    ) : (
                        <input onChange = {onChangeHandler} name = "name" value = {data.name} type="text" placeholder="your name" required />
                    )}

                    <input onChange = {onChangeHandler} name = "email" value = {data.email} type="email" placeholder="your email" required />
                    <input onChange = {onChangeHandler} name = "password" value = {data.password} type="password" placeholder="password" required />
                </div>
                <button  type = "submit">
                    {currState === "Sign Up" ? "Create account" : "Login"}   {/* ✅ fixed typo */}
                </button>
                <div className="login-popup-condition">
                    <input type="checkbox" />
                    <p>
                        By continuing, i agree to the terms of use and privecy
                        policy
                    </p>
                </div>
                {currState === "Login" ? (
                    <p>
                        Create a new account?{" "}
                        <span onClick={() => setCurrState("Sign Up")}>
                            Click here
                        </span>
                    </p>
                ) : (
                    <p>
                        Already have an account{" "}
                        <span onClick={() => setCurrState("Login")}>
                            Login here
                        </span>
                    </p>
                )}
            </form>
        </div>
    );
};
export default LoginPopup;
