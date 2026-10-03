import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Check, UserPlus } from "lucide-react";
import { getAllEmployees } from "@/lib/authService";
import { rolePermissions } from "../data/userManagementData";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DataTable,
  DataTableHead,
  DataTableBody,
  DataTableRow,
  DataTableHeadCell,
  DataTableCell,
} from "@/components/ui/data-table";

const roleStyles = {
  employee: "bg-primary/15 text-primary",
  hr: "bg-purple-500/15 text-purple-400",
  admin: "bg-destructive/15 text-destructive",
};

const avatarColors = ["bg-primary", "bg-purple-500", "bg-orange-500", "bg-violet-500", "bg-teal-500", "bg-pink-500"];

function getInitials(name) {
  return (name || "U").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await getAllEmployees();
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch users error:", err);
      toast.error("Failed to load user list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Roles, permissions, and access control</p>
        </div>
        <Button onClick={() => toast.info("New users sign up and are approved by HR/Admin")}>
          <UserPlus size={16} /> Add User
        </Button>
      </div>

      <Card className="overflow-hidden p-0 mb-8">
        <DataTable className="border-0">
          <DataTableHead>
            <DataTableRow>
              <DataTableHeadCell>User</DataTableHeadCell>
              <DataTableHeadCell>Role</DataTableHeadCell>
              <DataTableHeadCell>Dept</DataTableHeadCell>
              <DataTableHeadCell>Approval Status</DataTableHeadCell>
              <DataTableHeadCell>MFA</DataTableHeadCell>
              <DataTableHeadCell>Status</DataTableHeadCell>
            </DataTableRow>
          </DataTableHead>
          <DataTableBody>
            {loading ? (
              <DataTableRow>
                <DataTableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Loading users...
                </DataTableCell>
              </DataTableRow>
            ) : (
              users.map((u, idx) => (
                <DataTableRow key={u.id}>
                  <DataTableCell>
                    <div className="flex items-center gap-3">
                      <div className={`grid h-8 w-8 place-items-center rounded-full text-xs font-medium text-foreground ${avatarColors[idx % avatarColors.length]}`}>
                        {getInitials(u.name)}
                      </div>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </DataTableCell>
                  <DataTableCell>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full uppercase ${roleStyles[u.role] || roleStyles.employee}`}>
                      {u.role}
                    </span>
                  </DataTableCell>
                  <DataTableCell className="text-muted-foreground">{u.department || "General"}</DataTableCell>
                  <DataTableCell>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${u.approval_status === "Approved" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>
                      {u.approval_status}
                    </span>
                  </DataTableCell>
                  <DataTableCell>
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-success/15 text-success">
                      On
                    </span>
                  </DataTableCell>
                  <DataTableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <span className={`h-1.5 w-1.5 rounded-full ${u.status === "Active" ? "bg-success" : "bg-muted-foreground"}`} />
                      {u.status || "Active"}
                    </div>
                  </DataTableCell>
                </DataTableRow>
              ))
            )}
          </DataTableBody>
        </DataTable>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-5">Role Permissions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rolePermissions.map((r) => (
            <div key={r.role}>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${r.tone}`}>{r.role}</span>
              <ul className="mt-4 space-y-2.5">
                {r.permissions.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm">
                    <Check size={14} className="text-success" /> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default UserManagement;