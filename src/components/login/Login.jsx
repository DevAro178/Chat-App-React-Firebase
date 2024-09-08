import { toast } from "react-toastify"
import "./login.css"
import { useState } from "react"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth,db } from "../../lib/firebase"
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore"
import upload from "../../lib/upload"

const Login = () => {
    const [avatar,setAvatar]=useState({
        file:null,
        url:null
    })
    const [loading,setLoading]=useState(false)
    const handleImage=(e)=>{
        if(e.target.files[0]){
            setAvatar({
                file:e.target.files[0],
                url:URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handleLogin=async (e)=>{
        e.preventDefault()
        
        const formData=new FormData(e.target)
        const {email,password}=Object.fromEntries(formData)

        setLoading(true)
        try {
            await signInWithEmailAndPassword(auth,email,password)
            toast.success("Logged in successfully")
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        } finally{
            setLoading(false)
        }
    }

    const handleRegister=async (e)=>{
        e.preventDefault()
        const {username,email,password,passwordConfirm}=Object.fromEntries(new FormData(e.target))
        setLoading(true)
        const usersRef=collection(db,"users")
        
        const emailq = query(usersRef,where("email","==",email))
        const email_res=await getDocs(emailq)
        
        const usernameq = query(usersRef,where("username","==",username))
        const username_res=await getDocs(usernameq)
        
        if(!username_res.empty){
            toast.error("User already exists with this username")
            setLoading(false)
            return
        }
        if(!email_res.empty){
            toast.error("User already exists with this email")
            setLoading(false)
            return
        }
        
        if(password!==passwordConfirm){
            toast.error("Passwords do not match")
        }else{
            try {
                const res=await createUserWithEmailAndPassword(auth,email,password)

                let imgUrl=null
                if (avatar.file) imgUrl = await upload(avatar.file)

                await setDoc(doc(db,"users",res.user.uid),{
                    username,
                    email,
                    avatar:imgUrl,
                    id:res.user.uid,
                    blocked:[]
                })

                await setDoc(doc(db,"userchats",res.user.uid),{
                    chats:[]
                });

                toast.success("User created successfully")

            } catch (error) {
                console.log(error);
            } finally{
                setLoading(false)
            }
        }
        
    }

    return(
        <div className="login">
            <div className="item">
                <h2>Welcome back, </h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="Email" name="email" />
                    <input type="password" placeholder="Password" name="password" />
                    <button disabled={loading}>{loading?"Processing...":"Sign in"}</button>
                </form>
            </div>
            <div className="seperator"></div>
            <div className="item">
                <h2>Create an Account</h2>
                <form onSubmit={handleRegister}>
                    <label htmlFor="file">
                        <img src={avatar?.url || `/avatar.png`} alt="" />    
                        Upload an image
                    </label>
                    <input type="file" id="file" name="file" style={{display:`none`}} onChange={handleImage} />
                    <input type="text" placeholder="Username" name="username" />
                    <input type="text" placeholder="Email" name="email" />
                    <input type="password" placeholder="Password" name="password" />
                    <input type="password" placeholder="Confirm Password" name="passwordConfirm" />
                    <button disabled={loading}>{loading?"Processing...":"Sign up"}</button>
                </form>
            </div>
        </div>
    )

}

export default Login