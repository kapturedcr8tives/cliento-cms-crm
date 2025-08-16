"use client"

import { ColumnDef } from "@tanstack/react-table"
import { TeamMember } from "./validation"

// Placeholder type for now, will be replaced with API data
export const columns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: "full_name",
    header: "Name",
    cell: ({ row }) => row.original.full_name || <span className="text-gray-400">Invite Pending</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
        const role = row.getValue("role") as string;
        // This could be enhanced with colors
        return <span className="capitalize">{role.replace(/_/g, ' ')}</span>
    }
  },
  // Actions column (e.g., Remove, Change Role) will be added later
]
