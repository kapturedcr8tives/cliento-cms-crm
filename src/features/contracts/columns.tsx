"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"

// Placeholder type
export type Contract = {
  id: string
  name: string
  status: string
  end_date: string
  clients: { name: string } | null
  projects: { name: string } | null
}

export const columns: ColumnDef<Contract>[] = [
  {
    accessorKey: "name",
    header: "Contract Name",
    cell: ({ row }) => {
      const contract = row.original
      return <Link to={`/contracts/${contract.id}`} className="font-medium text-blue-600 hover:underline">{contract.name}</Link>
    },
  },
  {
    accessorKey: "clients.name",
    header: "Client",
    cell: ({ row }) => row.original.clients?.name || <span className="text-gray-400">N/A</span>
  },
  {
    accessorKey: "projects.name",
    header: "Project",
    cell: ({ row }) => row.original.projects?.name || <span className="text-gray-400">N/A</span>
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.getValue("status") as string;
        // This could be enhanced with colors
        return <span className="capitalize">{status}</span>
    }
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ row }) => {
      const date = row.getValue("end_date");
      return date ? new Date(date as string).toLocaleDateString() : <span className="text-gray-400">N/A</span>
    }
  },
]
