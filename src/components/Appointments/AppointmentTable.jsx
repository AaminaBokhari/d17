import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import AppointmentActions from './AppointmentActions';
import { FaSort, FaUser } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';

function AppointmentTable({ data = [], filters }) {
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor(row => {
      try {
        return format(parseISO(row.dateTime), 'HH:mm');
      } catch (e) {
        return 'Invalid Time';
      }
    }, {
      id: 'time',
      header: 'Time',
      cell: info => <span className="font-medium">{info.getValue()}</span>,
    }),
    columnHelper.accessor('patient.name', {
      header: 'Patient Name',
      cell: info => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
            <FaUser className="h-4 w-4" />
          </div>
          <span className="font-medium">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: info => (
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        const statusStyles = {
          Scheduled: 'bg-yellow-100 text-yellow-800',
          'In Progress': 'bg-green-100 text-green-800',
          Completed: 'bg-blue-100 text-blue-800',
          Cancelled: 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
          </span>
        );
      },
    }),
    columnHelper.accessor('notes', {
      header: 'Notes',
      cell: info => (
        <span className="text-sm text-gray-600 truncate max-w-xs block">
          {info.getValue() || '-'}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <AppointmentActions
          appointment={info.row.original}
          onUpdate={(apt) => console.log('Update:', apt)}
        />
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: filters?.search,
      columnFilters: [
        {
          id: 'status',
          value: filters?.status,
        },
        {
          id: 'type',
          value: filters?.type,
        },
      ],
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (!data.length) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No appointments found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center space-x-1">
                    <span>{flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}</span>
                    {header.column.getCanSort() && (
                      <FaSort className="text-gray-400" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr 
              key={row.id}
              className="hover:bg-gray-50 transition-colors"
            >
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap"
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AppointmentTable;