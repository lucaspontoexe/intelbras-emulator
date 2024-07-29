export interface RPC2Request<Params> {
    method: string;
    params: Params;
    id: number;
    session?: string;
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

interface LoginParams {
    userName: string;
    password: string;
    clientType: "Web3.0";
    loginType: "Direct";
}

export type LoginRequest = RPC2Request<LoginParams>;
