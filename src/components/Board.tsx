import Ball from './Ball'
import Header from './Header'
import { Connect4, Player } from 'connect4-engine'
import { C4Context } from '~/context/C4Context'

const Board = () => {
  return (
    <C4Context.Consumer>
      {({ playerAddr, players, gameArray, setGameArray, moves, setMoves }) => {
        const game = new Connect4([new Player('#000'), new Player('#FFF')])
        moves.map(move => game.insert(move))
        return <>
          <Header blur={!!game.state.winner} />
          <section className={game.state.winner ? 'board blur' : 'board'}>
            {gameArray.map((cell, index) => {
              return <Ball key={index} onClick={() => {
                const col = game.getColumnByIndex(index)
                const isPlaying = players.some((p) => p.addr === playerAddr)
                const isTurn = isPlaying ? game.state.playing.color === players.find(p => p.addr === playerAddr)?.color : false

                if (isTurn && game.insert(col)) {
                  const newMoves = [...moves, col]
                  setMoves(newMoves)
                  const nextPlayer = players.find(p => p.addr !== playerAddr)
                  const text = "It's " + nextPlayer?.name + " turn in Connect4"
                  window.webxdc.sendUpdate({ payload: { move: col, moves: newMoves, players }, info: text }, text)
                  setGameArray(game.state.board)
                }
              }}>{game.state.board[index] === null ? <div></div> : <div className={game.state.board[index].color === '#000' ? 'player1 dropdown' : 'player2 dropdown'}></div>}</Ball>
            })}
          </section>
          {game.state.winner && <div className="winner"><span className={game.state.winner.color === '#000' ? "red" : "yellow"}>{game.state.winner.color === '#000' ? players[0].name : players[1].name}</span></div>}
        </>
      }}
    </C4Context.Consumer>
  )
}

export default Board
