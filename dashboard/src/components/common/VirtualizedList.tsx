import React from 'react';
import { FixedSizeList as List } from 'react-window';
import { Box, ListItem, ListItemText, ListItemButton } from '@mui/material';

interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (props: { index: number; style: React.CSSProperties; item: T }) => React.ReactNode;
  onItemClick?: (item: T, index: number) => void;
  className?: string;
}

export const VirtualizedList = <T,>({
  items,
  height,
  itemHeight,
  renderItem,
  onItemClick,
  className,
}: VirtualizedListProps<T>) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = items[index];
    
    return (
      <div style={style}>
        {renderItem({ index, style, item })}
      </div>
    );
  };

  return (
    <Box className={className}>
      <List
        height={height}
        itemCount={items.length}
        itemSize={itemHeight}
        width="100%"
      >
        {Row}
      </List>
    </Box>
  );
};

export default VirtualizedList;
