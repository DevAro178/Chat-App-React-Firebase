import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand'
import { db } from './firebase';

const useUserStore = create((set) => ({
  current_user: null,
  isLoading: true,
  fetchUserInfo: async(uid) => {
    if(!uid)
        return set({current_user: null, isLoading: false})

    try {
        
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) 
            set({current_user: docSnap.data(), isLoading: false})
        else
            set({current_user: null, isLoading: false})
    } catch (error) {
        console.log(error);        
        return set({current_user: null, isLoading: false})
    }
  }
}))
export default useUserStore