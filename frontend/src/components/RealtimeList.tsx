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
import { Link } from '@/i18n/routing';
import { cleanText } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export default function RealtimeList() {
  const t = useTranslations('dashboard');
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

  const localizeLocation = React.useCallback((loc: any) => {
    if (!loc || loc === 'Emergency SOS Location') return t('emergencySosLocation');
    const s = String(loc);
    if (s.includes('New Delhi') || s.includes('Delhi')) return t('locNewDelhi');
    if (s.includes('Bengaluru') || s.includes('Karnataka')) return t('locBengaluru');
    if (s.includes('Ahmedabad') || s.includes('Gujarat')) return t('locAhmedabad');
    if (s.includes('Mumbai') || s.includes('Maharashtra')) return t('locMumbai');
    if (s.includes('Kolkata') || s.includes('Bengal')) return t('locKolkata');
    if (s.includes('Chennai') || s.includes('Tamil Nadu')) return t('locChennai');
    if (s.includes('Hyderabad') || s.includes('Telangana')) return t('locHyderabad');
    if (s.includes('Jaipur') || s.includes('Rajasthan')) return t('locJaipur');
    if (s.includes('Lucknow') || s.includes('Uttar Pradesh')) return t('locLucknow');
    if (s.includes('Pune')) return t('locPune');
    return s;
  }, [t]);

  const columns: ColumnDef<any>[] = React.useMemo(
    () => [
      {
        id: 'sno',
        header: t('sNo'),
        cell: ({ row }) => row.index + 1,
        enableSorting: false,
      },
      {
        accessorKey: 'Name',
        header: t('name'),
        cell: ({ row }) => {
          const survivorName =
            row.original.Name || row.original.name || t('anonymousSurvivor');
          return (
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {survivorName}
            </span>
          );
        },
      },
      {
        accessorKey: 'state',
        header: t('location'),
        cell: ({ row }) => <div>{localizeLocation(row.getValue('state'))}</div>,
      },
      {
        accessorKey: 'Severity of domestic violence',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('severity')}
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => {
          const rawSeverity = cleanText(row.getValue('Severity of domestic violence'));
          const severityColors = {
            'Very High': 'bg-red-500 text-white',
            High: 'bg-yellow-500 text-white',
            Medium: 'bg-blue-500 text-white',
            Low: 'bg-green-500 text-white',
          };
          const severityClass =
            severityColors[rawSeverity as keyof typeof severityColors] ||
            'bg-gray-300 text-black';

          const localizedLabel =
            rawSeverity === 'Very High' ? t('sevVeryHigh') :
            rawSeverity === 'High' ? t('sevHigh') :
            rawSeverity === 'Medium' ? t('sevMedium') :
            rawSeverity === 'Low' ? t('sevLow') : rawSeverity;

          return (
            <div
              className={`priority-badge ${severityClass} mx-auto text-center max-w-[80px] text-[10px] border px-1 py-1 rounded-full font-semibold`}
            >
              {localizedLabel}
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
        header: t('issue'),
        cell: ({ row }) => {
          const rawIssue = cleanText(row.getValue('Nature of domestic violence'));
          if (rawIssue.includes('forced isolation') || rawIssue.includes('Threats of violence')) return t('issueViolenceIsolation');
          if (rawIssue.includes('Domestic Violence Incident')) return t('issueDomesticViolence');
          if (rawIssue.includes('hurts child')) return t('issueHurtsChild');
          if (rawIssue.includes('Immediate shelter')) return t('issueShelterRequired');
          if (rawIssue.includes('Harassment & Safety Threat')) return t('issueHarassmentThreat');
          if (rawIssue.includes('Physical Assault')) return t('issuePhysicalAssault');
          if (rawIssue.includes('Severe Psychological Harassment')) return t('issuePsychologicalHarassment');
          if (rawIssue.includes('Financial Deprivation')) return t('issueFinancialDeprivation');
          return rawIssue;
        },
      },
      {
        accessorKey: 'status',
        header: t('status'),
        cell: ({ row }) => {
          const status = String(row.getValue('status') || '').toLowerCase();
          if (status === 'closed') return <div className="font-medium text-emerald-600 dark:text-emerald-400">{t('statusClosed')}</div>;
          if (status === 'pending') return <div className="font-medium text-amber-600 dark:text-amber-400">{t('statusPending')}</div>;
          if (status === 'resolved') return <div className="font-medium text-blue-600 dark:text-blue-400">{t('statusResolved')}</div>;
          return <div>{status}</div>;
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
                <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(post._id)}
                >
                  {t('copyId')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={`/post/${post._id}`}
                    prefetch={false}
                    className="w-full cursor-pointer flex items-center"
                  >
                    {t('viewDetails')}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [t]
  );

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

        setData(list);
      } catch (error) {
        console.error('Error fetching posts:', error);
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
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-rani" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 py-4">
        <Input
          placeholder={t('filterByName')}
          value={(table.getColumn('Name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('Name')?.setFilterValue(event.target.value)
          }
          className="max-w-full sm:max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto sm:ml-auto w-full sm:w-auto">
              {t('columnsBtn')} <ChevronDown />
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
                <TableCell colSpan={columns.length} className="text-center p-6 text-slate-500">
                  {t('noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
