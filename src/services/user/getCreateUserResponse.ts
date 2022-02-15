import { Ok, Err, Result } from "ts-results"
import { client } from "@/services"
import { ErrorCode, getErrorCode } from "@/services/errors";


export interface CreateUserRequest {
    username: string
    password: string
}

export interface CreateUserResponse {
    username: string
}

export async function getCreateUserResponse(newUserData: CreateUserRequest): Promise<Result<CreateUserResponse, ErrorCode>> {
    try {
        const response = await client.post("/user/new", newUserData);
        return Ok(response.data as CreateUserResponse)
    }
    catch (error) {
        return Err(getErrorCode(error))
    }
}