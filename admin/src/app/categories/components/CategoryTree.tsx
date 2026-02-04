import { ChevronRight, Folder } from "lucide-react";

const TREE_DATA = [
  {
    id: "1",
    name: "Electronics",
    level: 1,
    children: [
      { id: "2", name: "Mobiles", level: 2 },
      { id: "3", name: "Laptops", level: 2 },
    ],
  },
  { id: "4", name: "Fashion", level: 1 },
];

export default function CategoryTree() {
  return (
    <div className="p-4 space-y-1">
      <div className="mb-4 px-2 text-[12px] font-semibold text-gray-400 uppercase tracking-wider">
        Hierarchy
      </div>
      {TREE_DATA.map((item) => (
        <TreeNode key={item.id} item={item} />
      ))}
    </div>
  );
}

function TreeNode({ item, depth = 0 }: { item: any; depth?: number }) {
  const isSelected = item.id === "4"; // Example state

  return (
    <div>
      <div
        className={`flex h-9 items-center gap-2 rounded-md px-2 cursor-pointer transition-colors ${
          isSelected
            ? "bg-blue-50 text-primary"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <ChevronRight
          size={14}
          className={`text-gray-400 ${item.children ? "rotate-90" : ""}`}
        />
        <Folder
          size={14}
          className={isSelected ? "text-primary" : "text-gray-400"}
        />
        <span className="text-[13px] font-medium">{item.name}</span>
      </div>
      {item.children?.map((child: any) => (
        <TreeNode key={child.id} item={child} depth={depth + 1} />
      ))}
    </div>
  );
}
