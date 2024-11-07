import moment from "moment";
import React from "react";
import { MdOutlineClose } from "react-icons/md";

const FilterInfoTitle = ({ filterType, filterDates, onClear }) => {
  const DateRangeChip = ({ date }) => {
    //console.log("Date: ", date);
    const startDate = date?.from
      ? moment(date?.from).format("Do MMM YYYY")
      : "N/A";
    const endDate = date?.to ? moment(date?.to).format("Do MMM YYYY") : "N/A";
    //console.log("StartDate: ", startDate);
    //console.log("EndDate: ", endDate);

    return (
      <div className="flex items-center gap-3 text-slate-100 bg-blue-400 px-3 m-2 ml-0 py-2 rounded">
        <p className="text-sm font-medium">
          {startDate} - {endDate}
        </p>

        <button onClick={onClear}>
          <MdOutlineClose className="font-medium hover:text-white hover:bg-red-500 hover:rounded-full" />
        </button>
      </div>
    );
  };
  return (
    filterType && (
      <div className="mt-5">
        {filterType === "search" ? (
          <h3 className="text-lg font-medium">Search Results</h3>
        ) : (
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Travel Stories from</h3>
            <DateRangeChip date={filterDates} />
          </div>
        )}
      </div>
    )
  );
};

export default FilterInfoTitle;
