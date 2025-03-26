interface TabProps {
  className: string;
  children: React.ReactNode;
  id: number;
  onClick?: React.MouseEventHandler;
}

export default function Tab({
  id,
  onClick,
  children,
  className = "",
}: TabProps) {
  return (
    <div id={id} onClick={onClick} className={`tab ${className}`}>
      {children}
    </div>
  );
}
