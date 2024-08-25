import { createContext, ReactNode, useState } from "react"

import { UserDTO } from "@dtos/UserDTO"

export type AuthContextDataProps = {
  user: UserDTO
  setUser: ( user: UserDTO ) => void
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

type AuthContextProviderProps = {
  children: ReactNode
}
export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState({
    id: "1",
    name: "Samuel",
    email: "samuel@gmail.com",
    avatar: "samuel.png",
  })

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
} 