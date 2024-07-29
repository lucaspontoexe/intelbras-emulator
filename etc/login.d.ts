export interface LoginRequest {
    method: "global.login"
    params: Params
    id: number
  }
  
  export interface Params {
    userName: string
    password: string
    clientType: "Web3.0"
    loginType: "Direct"
  }
  