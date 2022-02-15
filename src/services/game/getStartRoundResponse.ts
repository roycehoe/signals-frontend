import { Ok, Err, Result } from "ts-results"
import { client } from "@/services"
import { ErrorCode, getErrorCode } from "@/services/errors";
import { GameInfoResponse } from "@/services/game/getGameInfoResponse"


export async function getStartRoundResponse(): Promise<Result<GameInfoResponse, ErrorCode>> {
    try {
        const response = await client.get("/game/game");
        return Ok(response.data as GameInfoResponse)
    }
    catch (error) {
        return Err(getErrorCode(error))
    }
}