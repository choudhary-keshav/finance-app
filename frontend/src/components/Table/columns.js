import React from 'react';
  
  const Columns = () =>  {
	return (
	  <div>
	  </div>
	);
  }
  
  export default Columns;
  export const COLUMNS = [
  {
    Header: "Date",
    accessor: "transactions.transactionDate",
  },
  {
    Header: "Description",
    accessor: "transactions.description",
  },
  {
    Header: "Debit",
    accessor: "transactions.debit",
  },
  {
    Header: "Credit",
    accessor: "transactions.credit",
  },
  {
    Header: "Balance",
    accessor: "transactions.balance",
  },
  {
    Header: "Category",
    accessor: "transactions.category",
  },
];
