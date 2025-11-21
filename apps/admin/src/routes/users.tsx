import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { api } from "../lib/api";

type User = {
	id: number;
	email: string;
	userName: string;
	role: string;
	createdAt: string;
};

export const Route = createFileRoute("/users")({
	component: UsersComponent,
});

function UsersComponent() {
	const {
		data: users,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const res = await api.get<User[]>("/users");
			return res.data;
		},
	});

	const columnHelper = createColumnHelper<User>();

	const columns = [
		columnHelper.accessor("id", {
			header: "ID",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("userName", {
			header: "Username",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("email", {
			header: "Email",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("role", {
			header: "Role",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("createdAt", {
			header: "Created At",
			cell: (info) => new Date(info.getValue()).toLocaleDateString(),
		}),
	];

	const table = useReactTable({
		data: users || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	if (isLoading) return <div className="p-4">Loading...</div>;
	if (error) return <div className="p-4 text-red-500">Error loading users</div>;

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Users</h1>
			<div className="overflow-x-auto border rounded-lg">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th
										key={header.id}
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{table.getRowModel().rows.map((row) => (
							<tr key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<td
										key={cell.id}
										className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
