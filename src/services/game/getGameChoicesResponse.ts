import { Err, Ok, Result } from "ts-results";
import { client } from "..";
import { ErrorCode, getErrorCode } from "../errors";
import { Card, GameInfoResponse } from "./getGameInfoResponse";


export enum Prediction {
    HIGHER = "Higher",
    LOWER = "Lower"
}

export interface GameChoicesRequest {
    prediction: Prediction
    bet: number
}

export interface GameChoicesResponse extends GameInfoResponse {
    next_card: Card,
    win: boolean
}

export async function getGameChoicesResponse(gameChoices: GameChoicesRequest): Promise<Result<GameChoicesResponse, ErrorCode>> {
    try {
        const response = await client.post("/game/play", gameChoices)
        return Ok(response.data as GameChoicesResponse)
    }
    catch (error) {
        return Err(getErrorCode(error))
    }
}