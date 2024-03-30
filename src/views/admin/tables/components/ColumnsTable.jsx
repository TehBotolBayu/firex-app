import CardMenu from "../../../../components/card/CardMenu";
import Card from "../../../../components/card";
import React, { useMemo } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { IoTrash, IoPencil } from "react-icons/io5";
{/* <IoAlertCircle className={color(e.status)} /> */}

const ColumnsTable = (props) => {
  const { columnsData, tableData, title, setform, user, deleteHandler, editHandler } = props;

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
    nextPage,
    previousPage, canPreviousPage, canNextPage
  } = tableInstance;
  initialState.pageSize = 5;


  return (
    <Card extra={"w-full pb-10 p-4 h-full"}>
      <header className="relative flex items-center justify-between w-full">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          {title}
        </div>
        <div className="flex">
          <button className="mx-4 linear mt-2 px-4 rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200" 
          onClick={() => setform(p => !p)}>Tambah Data</button>
          <button className="mx-4 linear mt-2 px-4 rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200" 
          onClick={() => {}}>Hapus Data</button>
          <button className="mx-4 linear mt-2 px-4 rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200" 
          onClick={() => {}}>Update Data</button>
          <CardMenu />

        </div>
      </header>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table {...getTableProps()} className="w-full">
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={index}
                    className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700"
                  >
                    <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                      {column.render("Header")}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
                  {/* <th
                    className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700"
                    >
                    <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                      ACTION
                    </div>
                  </th> */}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              // console.log(row);
              // console.log(row.original._id);
              return (
                <tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    let data;
                      data = (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {cell.value}
                        </p>
                      );
                    return (
                      <td
                        className="pt-[14px] pb-[20px] sm:text-[14px]"
                        {...cell.getCellProps()}
                        key={index}
                      >
                        {data}
                      </td>
                    );
                  })}
                <td>
                  <button onClick={() => editHandler(row.id, title)}>
                    <IoPencil className="h-5 w-5" />
                  </button>
                  <button onClick={() => deleteHandler(row.original._id, title)}>
                    <IoTrash className="h-5 w-5" />
                  </button>
                </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
      <button className="mx-5" onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>
      </div>
    </Card>
  );
};

export default ColumnsTable;
