// ok, pra quê transformar method em generic

export interface RPC2Request<Method, Params> {
    method: Method;
    params: Params;
    id: number;
    session: string;
}

export interface RPC2Response<Params> {
    result: boolean;
    params: Params;
    error?: { code: number; message: string };
    id: number;
    session: string;
}

// test: login
// a gente não precisa sair tipando requests, né? tem mais o que fazer

type LoginRequest = RPC2Request<"global.login", {
    userName: string;
    password: string;
    clientType: "Web3.0";
    loginType: "Direct";
}>;
