import { useEffect } from "react"
import Chat from "./components/chat/Chat"
import Detail from "./components/detail/Detail"
import List from "./components/list/List"
import Login from "./components/login/Login"
import Notification from "./components/notification/Notification"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./lib/firebase"
import useUserStore from "./lib/userStore"
import useChatStore from "./lib/chatStore"

const App = () => {

  const {current_user,isLoading,fetchUserInfo}=useUserStore()
  const {chatId}=useChatStore()

  useEffect(()=>{
    const unSub=onAuthStateChanged(auth,(user)=>{
      console.log(user,isLoading);
        fetchUserInfo(user?.uid)

      })
      return ()=>unSub()
  },[fetchUserInfo])

  console.log(current_user,isLoading)


  return (
    
      isLoading ?
      ( <div className="loading">Loading....</div>

      ) : (
        <div className='container'>
        {
          current_user ?(
            <>
              <List />
              {chatId && <Chat />}
              {chatId && <Detail />}
            </>
          ):(<Login />)
        }
        <Notification />
      </div>
    )
    
  )
}

export default App