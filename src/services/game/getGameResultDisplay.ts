import { Prediction } from "@/services/game/getGameChoicesResponse"

export function getGameResultDisplay(isWinner: boolean, playerPrediction: Prediction): Prediction {
    if (isWinner) {
        return playerPrediction
    } else if (playerPrediction === Prediction.HIGHER) {
        return Prediction.LOWER
    } else {
        return Prediction.HIGHER
    }
}