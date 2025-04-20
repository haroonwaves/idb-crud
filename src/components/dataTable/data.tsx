import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/src/components/ui/checkbox';
import { ColumnHeader } from '@/src/components/dataTable/ColumnHeader';

type Payment = {
	id: string;
	amount: number;
	status: 'pending' | 'processing' | 'success' | 'failed';
	email: string;
};

export const payments: Payment[] = [
	{
		id: '728ed52f',
		amount: 100,
		status: 'pending',
		email: 'm@example.com',
	},
	{
		id: '489e1d42',
		amount: 125,
		status: 'processing',
		email: 'example@gmail.com',
	},
];

export const columns: ColumnDef<Payment>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'status',
		header: ({ column }) => <ColumnHeader column={column} title="Status" />,
	},
	{
		accessorKey: 'email',
		header: ({ column }) => <ColumnHeader column={column} title="Email" />,
	},
	{
		accessorKey: 'amount',
		header: ({ column }) => <ColumnHeader column={column} title="Amount" />,
	},
];
