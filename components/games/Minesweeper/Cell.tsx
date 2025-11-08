import { Cell as CellType } from '@/lib/types';

interface CellProps {
  cell: CellType;
  onReveal: (row: number, col: number) => void;
  onToggleFlag: (row: number, col: number) => void;
}

export default function Cell({ cell, onReveal, onToggleFlag }: CellProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cell.state === 'hidden') {
      onReveal(cell.row, cell.col);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cell.state === 'hidden' || cell.state === 'flagged') {
      onToggleFlag(cell.row, cell.col);
    }
  };

  const getCellContent = () => {
    if (cell.state === 'flagged') {
      return '🚩';
    }
    if (cell.state === 'revealed') {
      if (cell.isMine) {
        return '💣';
      }
      if (cell.adjacentMines > 0) {
        return cell.adjacentMines.toString();
      }
      return '';
    }
    return '';
  };

  const getCellClassName = () => {
    const base = 'w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm font-bold border border-gray-300 transition-colors cursor-pointer select-none';
    
    if (cell.state === 'revealed') {
      if (cell.isMine) {
        return `${base} bg-red-200 dark:bg-red-900`;
      }
      return `${base} bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100`;
    }
    
    if (cell.state === 'flagged') {
      return `${base} bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800`;
    }
    
    return `${base} bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600`;
  };

  const getNumberColor = () => {
    const colors = [
      '', // 0
      'text-blue-600 dark:text-blue-400', // 1
      'text-green-600 dark:text-green-400', // 2
      'text-red-600 dark:text-red-400', // 3
      'text-purple-600 dark:text-purple-400', // 4
      'text-yellow-600 dark:text-yellow-400', // 5
      'text-pink-600 dark:text-pink-400', // 6
      'text-gray-800 dark:text-gray-200', // 7
      'text-gray-900 dark:text-gray-100', // 8
    ];
    return colors[cell.adjacentMines] || '';
  };

  return (
    <button
      className={getCellClassName()}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      disabled={cell.state === 'revealed'}
    >
      <span className={getNumberColor()}>{getCellContent()}</span>
    </button>
  );
}

