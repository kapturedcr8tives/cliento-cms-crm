"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"

// Placeholder type
export type Project = {
  id: string
  name: string
  status: string
  end_date: string
  clients: { name: string } | null
}

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: "Project Name",
    cell: ({ row }) => {
      const project = row.original
      // Link to the project detail page
      return <Link to={`/projects/${project.id}`} className="font-medium text-blue-600 hover:underline">{project.name}</Link>
    },
  },
  {
    accessorKey: "clients.name",
    header: "Client",
    cell: ({ row }) => {
        return row.original.clients?.name || <span className="text-gray-400">No Client</span>
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
        const status = row.getValue("status") as string;
        // Simple status display, can be enhanced with colors like before
        return <span className="capitalize">{status.replace(/_/g, ' ')}</span>
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
  // Actions column will be added later
]
