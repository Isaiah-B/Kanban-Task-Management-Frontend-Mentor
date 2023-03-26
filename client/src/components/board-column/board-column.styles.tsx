import styled from 'styled-components';

const columnColors = [
  'hsl(193, 75%, 59%)',
  'hsl(249, 83%, 70%)',
  'hsl(154, 68%, 64%)',
  'hsl(0, 59%, 54%)',
];

export const BoardColumnContainer = styled.div`
  height: 100%;
  width: 29.6rem;
`;

export const BoardColumnHeader = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-bottom: 2.4rem;
  padding: 0 0.8rem;
`;

export const BoardColumnCircle = styled.div<{ colorIndex: number }>`
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-color: ${(props) => columnColors[props.colorIndex % columnColors.length]};
`;

export const BoardColumnName = styled.h4`
  text-transform: uppercase;
`;

export const ColumnTaskList = styled.div`
  display: flex;
  flex-direction: column;

  height: 100%;
  
  
  .list-wrap {
    padding: 0 0.8rem;
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
