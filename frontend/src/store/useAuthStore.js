import {create} from "zustand";

export const useAuthStore = create((set)=>({
    authUser: {name:"John",_id:123,age:20},
    isLoading: false,
    login: ()=>{
        console.log("We just logged in")
    }
}))