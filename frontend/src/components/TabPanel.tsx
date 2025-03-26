interface TabPanelProps {
  children: React.ReactNode;
  currentTab: number;
  index: number;
  className: string;
}

export default function TabPanel({
  children,
  className = "",
  currentTab,
  index = 0,
}: TabPanelProps) {
  return (
    <div
      className={`${className} tabpanel ${
        currentTab == index ? "show" : "hidden"
      }`}
    >
      {children}
    </div>
  );
}
