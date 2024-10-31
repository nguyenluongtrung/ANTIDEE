
import React from 'react';

const Pagination = ({ totalPages, currentPage, onPageChange, onNextPage, onPreviousPage }) => {
    return (
        

                <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                    <button
                        onClick={onPreviousPage}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-l-md px-4 py-2 text-black border border-blue
                            hover:bg-light_gray disabled:opacity-50 focus:z-20 focus:outline-offset-0"
                    >
                        <span className="sr-only">Previous</span>
                        <p aria-hidden="true" className="h-5 w-fit">{"<"}</p>
                    </button>

                    {[...Array(totalPages)].map((_, pageIndex) => {
                        const pageNum = pageIndex + 1;
                        if (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                            return (
                                <button
                                    key={pageIndex}
                                    onClick={() => onPageChange(pageNum)}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold border
                                        border-blue ${currentPage === pageNum
                                        ? 'z-10 bg-purple text-white'
                                        : 'text-black hover:bg-light_gray'
                                    } focus:z-20 focus:outline-offset-0`}
                                >
                                    {pageNum}
                                </button>
                            );
                        } else if (
                            (pageNum === currentPage - 2 && pageNum > 1) ||
                            (pageNum === currentPage + 2 && pageNum < totalPages)
                        ) {
                            return (
                                <span key={pageIndex} className="px-4 py-2 text-gray-500">
                                    ...
                                </span>
                            );
                        }
                        return null;
                    })}

                    <button
                        onClick={onNextPage}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center rounded-r-md px-4 py-2 text-black border border-blue
                         hover:bg-light_gray disabled:opacity-50 focus:z-20 focus:outline-offset-0"
                    >
                        <span className="sr-only">Next</span>
                        <p aria-hidden="true" className="h-5 w-fit">{">"}</p>
                    </button>
                </nav>
    );
};

export default Pagination;