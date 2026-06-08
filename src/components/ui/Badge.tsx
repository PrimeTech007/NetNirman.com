interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export default function Badge({ children, color = "#FFE600", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-bold border-2 border-black ${className}`}
      style={{ backgroundColor: color, borderRadius: "2px" }}
    >
      {children}
    </span>
  );
}
