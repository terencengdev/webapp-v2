interface TabsProps {
  className: string;
  children: React.ReactNode;
}
export default function Tabs({ children, className = "" }: TabsProps) {
  return <div className={`tabs ${className}`}>{children}</div>;
}
