import { Ok, Err, Result } from "ts-results";
import { client } from "..";
import { ErrorCode, getErrorCode } from "../errors";



export interface Card {
    rank: string
    suit: string
    name: string
}

export interface GameInfoResponse {
    player_name: string,
    money: number,
    round: number,
    base_card: Card
}

export async function getGameInfoResponse(): Promise<Result<GameInfoResponse, ErrorCode>> {
    try {
        const response = await client.get("game/info");
        return Ok(response.data as GameInfoResponse)
    }
    catch (error) {
        return Err(getErrorCode(error))
    }
}