"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { useDeleteClient } from "./useClients"

// This type is manually created for now. In a real app,
// you would generate this from your Supabase schema.
export type Client = {
  id: string
  name: string
  email: string
  phone: string;
  address: string;
  status: "active" | "inactive" | "archived"
  created_at: string
}

const ActionsCell = ({ client, onEdit }: { client: Client, onEdit: (client: Client) => void }) => {
  const { remove, isDeleting } = useDeleteClient();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${client.name}?`)) {
      remove(client.id);
    }
  }

  return (
    <div className="space-x-2">
      <button onClick={() => onEdit(client)} className="p-2 hover:bg-gray-100 rounded-full" title="Edit">
        <Edit className="h-4 w-4 text-gray-600" />
      </button>
      <button onClick={handleDelete} disabled={isDeleting} className="p-2 hover:bg-gray-100 rounded-full" title="Delete">
        <Trash2 className="h-4 w-4 text-red-500" />
      </button>
    </div>
  )
}

export const getColumns = (onEdit: (client: Client) => void): ColumnDef<Client>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusClass = {
        active: "bg-green-100 text-green-800",
        inactive: "bg-yellow-100 text-yellow-800",
        archived: "bg-gray-100 text-gray-800",
      }[status] ?? "bg-gray-100 text-gray-800";

      return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
          {status}
        </span>
      )
    }
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return <span>{date.toLocaleDateString()}</span>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const client = row.original;
      return <ActionsCell client={client} onEdit={onEdit} />;
    },
  },
]
