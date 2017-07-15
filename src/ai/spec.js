import { move } from '.';

describe('ai', () => {
  describe('move', () => {
    it('finds the best next move I', () => {
      const game = {
        players: ['x', 'o'],
        turn: 'o',
        board: [
          ['x', '', ''],
          ['', '', ''],
          ['', '', '']
        ]
      };
      const nextMove = move(game);
      expect(nextMove.y).toEqual(1);
      expect(nextMove.x).toEqual(1);
    });

    it('finds the best next move II', () => {
      const game = {
        players: ['x', 'o'],
        turn: 'o',
        board: [
          ['x', 'x', 'o'],
          ['o', '', ''],
          ['x', 'o', 'x']
        ]
      };
      const nextMove = move(game);
      expect(nextMove.y).toEqual(1);
      expect(nextMove.x).toEqual(1);
    });

    it('finds the best next move III', () => {
      const game = {
        players: ['x', 'o'],
        turn: 'o',
        board: [
          ['x', 'o', 'x'],
          ['o', 'o', ''],
          ['x', 'x', '']
        ]
      };
      const nextMove = move(game);
      expect(nextMove.y).toEqual(1);
      expect(nextMove.x).toEqual(2);
    });
  });
});
