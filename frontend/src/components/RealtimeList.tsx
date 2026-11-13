'use client';
import * as React from 'react';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  ChevronDown,
  Loader2,
  MoreHorizontal,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { cleanText, fetchCityName } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const columns: ColumnDef<any>[] = [
  {
    id: 'sno',
    header: 'S.No',
    cell: ({ row }) => row.index + 1,
    enableSorting: false,
  },
  {
    accessorKey: 'Name',
    header: 'Name',
    cell: ({ row }) => {
      const survivorName =
        row.original.Name || row.original.name || 'Anonymous Survivor';
      return (
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          {survivorName}
        </span>
      );
    },
  },
  {
    accessorKey: 'state',
    header: 'Location',
    cell: ({ row }) => <div>{row.getValue('state') || 'Loading...'}</div>,
  },
  {
    accessorKey: 'Severity of domestic violence',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Severity
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const severity = cleanText(row.getValue('Severity of domestic violence'));
      const severityColors = {
        'Very High': 'bg-red-500 text-white',
        High: 'bg-yellow-500 text-white',
        Medium: 'bg-blue-500 text-white',
        Low: 'bg-green-500 text-white',
      };
      const severityClass =
        severityColors[severity as keyof typeof severityColors] ||
        'bg-gray-300 text-black'; // Default to gray if severity is unknown

      return (
        <div
          className={`priority-badge ${severityClass} mx-auto text-center max-w-[80px] text-[10px] border px-1 py-1 rounded-full`}
        >
          {severity}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const priorityOrder = { 'Very High': 0, High: 1, Medium: 2, Low: 3 };
      const severityA = cleanText(
        rowA.getValue('Severity of domestic violence')
      );
      const severityB = cleanText(
        rowB.getValue('Severity of domestic violence')
      );
      return (
        priorityOrder[severityA as keyof typeof priorityOrder] -
        priorityOrder[severityB as keyof typeof priorityOrder]
      );
    },
  },
  {
    accessorKey: 'Nature of domestic violence',
    header: 'Issue',
    cell: ({ row }) => cleanText(row.getValue('Nature of domestic violence')),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status');
      return (
        <div>
          {typeof status === 'string'
            ? status.charAt(0).toUpperCase() + status.slice(1)
            : ''}
        </div>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const post = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(post._id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/post/${post._id}`} prefetch={false}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function RealtimeList() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getPosts');
        const rawResult = await response.json();
        let list = Array.isArray(rawResult) ? rawResult : [];

        // Merge locally submitted posts from browser localStorage
        if (typeof window !== 'undefined') {
          const localSaved = localStorage.getItem('safespark_local_posts');
          if (localSaved) {
            try {
              const parsedLocal = JSON.parse(localSaved);
              if (Array.isArray(parsedLocal)) {
                const existingIds = new Set(list.map((p: any) => p._id));
                const uniqueLocal = parsedLocal.filter((p: any) => !existingIds.has(p._id));
                list = [...uniqueLocal, ...list];
              }
            } catch (err) {
              console.warn('Local post merge notice:', err);
            }
          }
        }

        const enrichedData = await Promise.all(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          list.map(async (post: any) => {
            const clenLoc = cleanText(post.Location || post.location || '');
            if (post.state && post.state !== 'Emergency SOS Location' && post.state !== 'Unknown Location') {
              return post;
            }
            const [latitude, longitude] = clenLoc.includes(',')
              ? clenLoc.split(',').map(Number)
              : [0, 0];
            
            let stateName = post.state;
            if (latitude && longitude) {
              try {
                const fetchedState = await fetchCityName(latitude, longitude);
                if (fetchedState) stateName = fetchedState;
              } catch (e) {}
            }

            const victimName = post.Name || post.name || 'Anonymous Survivor';
            return {
              ...post,
              Name: victimName,
              name: victimName,
              state: stateName || post.state || 'Emergency SOS Location',
            };
          })
        );

        setData(enrichedData);
      } catch (error) {
        console.warn('Dashboard data fetch notice:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (loading) {
    return (
      <div>
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 py-4">
        <Input
          placeholder="Filter by name..."
          value={(table.getColumn('Name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('Name')?.setFilterValue(event.target.value)
          }
          className="max-w-full sm:max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto sm:ml-auto w-full sm:w-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-[650px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>No results.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
