import { Ok, Err, Result } from "ts-results"
import { client } from "@/services"
import { ErrorCode, getErrorCode } from "@/services/errors";

export interface AuthUserResponse {
    access_token: string
    token_type: string
}

export interface AuthUserRequest {
    username: string
    password: string
}

export async function getAuthUserResponse(userCredentials: AuthUserRequest): Promise<Result<AuthUserResponse, ErrorCode>> {
    try {
        const response = await client.post("/login", userCredentials);
        return Ok(response.data as AuthUserResponse)
    }
    catch (error) {
        return Err(getErrorCode(error))
    }
}