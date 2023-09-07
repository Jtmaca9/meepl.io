import { createGameConfig, createGridZones, MOVE_ERROR } from 'meepl';
import ChessPieces, { ChessPieceType } from './ChessPieces';
import { isZoneAvailable } from './Logic';

const zones = createGridZones({
  rows: 8,
  columns: 8,
  gridSize: 45,
  offsetX: 20,
  offsetY: 20,
});

const pieces = [
  {
    id: 'white-rook-1',
    type: ChessPieceType.rook,
    name: 'White Rook 1',
    currZoneId: '0-0',
    owner: '0',
  },
  {
    id: 'white-rook-2',
    type: ChessPieceType.rook,
    name: 'White Rook 2',
    currZoneId: '3-3',
    owner: '1',
  },
];

const moves = {
  // @ts-ignore
  setActivePiece: ({ G, ctx, player }, pieceId) => {
    if (G.pieces.find((p) => p.id === pieceId).owner !== ctx.currentPlayer)
      return MOVE_ERROR.INVALID_MOVE;
    player.set({
      ...player.get(),
      activePiece: pieceId,
    });
  },
  // @ts-ignore
  movePiece: ({ G, player }, zoneId) => {
    let moveSuccessful = false;
    const currPlayer = player.get();
    const piece = G.pieces.find((p) => p.id === currPlayer.activePiece);
    if (!piece) return MOVE_ERROR.INVALID_MOVE;
    if (isZoneAvailable(zoneId, currPlayer, { G })) {
      piece.currZoneId = zoneId;
      moveSuccessful = true;
    }
    player.set({
      ...currPlayer,
      activePiece: null,
    });
    return moveSuccessful ? undefined : MOVE_ERROR.INVALID_MOVE;
  },
};

const ChessGame = createGameConfig({
  name: 'Chess',
  zones,
  pieces,
  pieceTypes: ChessPieces,
  moves,
  minPlayers: 1,
  maxPlayers: 2,
  undoAllowed: true,
  playerView: (players) => players,
  playerSetup: (playerID) => ({
    name: `Player ${playerID}`,
    activePiece: null,
  }),
});

export default ChessGame;
