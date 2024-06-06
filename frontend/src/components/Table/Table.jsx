import { useMemo, useState } from "react";
import { useTable, usePagination } from "react-table";
import { COLUMNS } from "./columns";
import "./styles.css";

export const Table = ({ givenData }) => {
  console.log(givenData);
  const [currentPage, setCurrentPage] = useState(1);
  const maxButtons = [-3, -2, -1, 0, 1, 2, 3];
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => givenData, []);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    canNextPage,
    previousPage,
    pageCount,
    gotoPage,
    canPreviousPage,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    usePagination
  );

  return (
    <>
      <div id="tableWrapper">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()} key={column.id}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.id}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()} key={cell.id}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="tableNavigator">
        <button
          onClick={() => {
            gotoPage(0);
            setCurrentPage(0);
          }}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </button>
        <button
          onClick={() => {
            previousPage();
            setCurrentPage(currentPage - 1);
          }}
          disabled={!canPreviousPage}
        >
          {"<"}
        </button>
        {maxButtons.map((num, index) => {
          const page = num + currentPage;
          if (page <= pageCount - 1 && page > -1) {
            return (
              <button
                key={index}
                className={page === currentPage ? "currentPage" : "otherPage"}
                onClick={() => {
                  gotoPage(page);
                  setCurrentPage(page);
                }}
              >
                {page + 1}
              </button>
            );
          }
        })}
        <button
          onClick={() => {
            nextPage();
            setCurrentPage(currentPage + 1);
          }}
          disabled={!canNextPage}
        >
          {">"}
        </button>
        <button
          onClick={() => {
            gotoPage(pageCount - 1);
            setCurrentPage(pageCount - 1);
          }}
          disabled={!canNextPage}
        >
          {">>"}
        </button>
      </div>
    </>
  );
};
