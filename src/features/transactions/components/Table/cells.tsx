// DateCellRenderer.tsx
import React from 'react';

interface DateCellRendererProps {
  date: Date;
}

export const DateCellRenderer: React.FC<DateCellRendererProps> = ({ date }) => {
  const formattedDate = new Intl.DateTimeFormat('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).format(date);
  return <div className="flex justify-center items-center">{formattedDate}</div>;
};

interface CategoryRendererProps {
  category: string;
  row: {
    getCanExpand: () => boolean;
    getIsExpanded: () => boolean;
    getToggleExpandedHandler: () => () => void;
  };
}

export const CategoryRenderer: React.FC<CategoryRendererProps> = ({ category, row }) => {
  if (!row.getCanExpand()) {
    return category
  }

  return (
    <button
      type="button"
      className="rounded-md bg-muted/20 px-2 py-1 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      aria-label={row.getIsExpanded() ? "Collapse split transaction" : "Expand split transaction"}
      aria-expanded={row.getIsExpanded()}
      onClick={row.getToggleExpandedHandler()}
    >
      {category}
    </button>
  );
};

export const AmountCellRenderer: React.FC<{ amount: number }> = ({ amount }) => {
  const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return <div className="flex justify-end">{formattedAmount}</div>;
}