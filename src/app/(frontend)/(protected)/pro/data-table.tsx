import * as React from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { MoreVertical, Settings, User, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const roleColors: Record<string, string> = {
  Editor: "text-blue-600 px-2 py-1 rounded-md",
  Admin: "text-red-600 px-2 py-1 rounded-md",
  Subscriber: "text-green-600 px-2 py-1 rounded-md",
};

const statusColors: Record<string, string> = {
  Confirm: "text-green-600 px-2 py-1 rounded-md",
  Pending: "text-yellow-600 px-2 py-1 rounded-md",
  Rejected: "text-red-600 px-2 py-1 rounded-md",
};

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Member Name", width: 150 },
  { field: "email", headerName: "E-Mail Address", width: 200 },
  { field: "plans", headerName: "Member Plans", width: 130 },
  { field: "spend", headerName: "Total Spend", width: 130 },
  {
    field: "role",
    headerName: "WordPress Role",
    width: 150,
    renderCell: (params: GridRenderCellParams<{ role: string }>) => (
      <span className={roleColors[params.value as keyof typeof roleColors] || "text-gray-600 bg-gray-100 px-2 py-1 rounded-md"}>
        {params.value}
      </span>
    ),
  },
  {
    field: "status",
    headerName: "E-Mail Status",
    width: 150,
    renderCell: (params: GridRenderCellParams<{ status: string }>) => (
      <span className={statusColors[params.value as keyof typeof statusColors] || "text-gray-600 bg-gray-100 px-2 py-1 rounded-md"}>
        {params.value}
      </span>
    ),
  },  
  { field: "joined", headerName: "Member Since", width: 150 },
  {
    field: "details",
    headerName: "Details",
    width: 100,
    renderCell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 hover:bg-gray-200 rounded">
            <MoreVertical size={18} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Settings size={16} className="mr-2" /> Manage Plans
          </DropdownMenuItem>
          <DropdownMenuItem>
            <User size={16} className="mr-2" /> Member Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Mail size={16} className="mr-2" /> Direct Email
          </DropdownMenuItem>
        </DropdownMenuContent>

      </DropdownMenu>
    ),
  },
];

const paginationModel = { page: 0, pageSize: 5 };

interface DataTableProps {
  rows: Array<{ id: number; name: string; email: string; plans: string; spend: string; role: string; status: string; joined: string }>;
}

export default function DataTable({ rows }: DataTableProps) {
  return (
    <div className="bg-cardBg rounded-lg shadow-md w-full overflow-x-auto text-text">
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 15, 20]}
        checkboxSelection
        sx={{
          color: "inherit",
          border: 0,
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "rgba(189, 195, 255, 0.15) !important", 
            fontWeight: "600 !important",
            color: "black",
          },
          "& .MuiTablePagination-root": {
            color: "inherit !important",
          },
          "& .MuiCheckbox-root": {
            color: "var(--title) !important", 
          },
          "& .Mui-checked": {
            color: "var(--title) !important", 
          },
        }}
      />
    </div>
  );
}
