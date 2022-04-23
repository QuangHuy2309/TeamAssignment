import React, {Component, useState, useEffect} from 'react';
import {Pagination, PaginationItem, PaginationLink} from "reactstrap";
import "./Pagination.css";

export default function Paginate(props) {

    const pageNumbers = [];

    const [currentPage, setCurrentPage] = useState(1);

    const maxPage = Math.ceil(props.total / props.size);

    for (let i = 1; i <= maxPage; i++) {
        pageNumbers.push(i);
    }

    useEffect(() => {
        props.handleCurrentPage(currentPage);
    }, [currentPage]);

    function handlePrevious() {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    function handleNext() {
        if (currentPage < maxPage) {
            setCurrentPage(currentPage + 1);
        }
    }


    return (
        <nav>
            <Pagination aria-label="Page navigation example" key="Page" className="pagination justify-content-end"
                        id="pagination">
                <PaginationItem>
                    <PaginationLink
                        id="pagination_link"
                        style={{color: "black"}}
                        previous
                        onClick={() => handlePrevious()}
                    />
                </PaginationItem>
                {pageNumbers.map(number => (
                    <PaginationItem key={number} className="page-item">
                        <PaginationLink id="pagination_link" style={{color: "black"}} onClick={() => {
                            props.handleCurrentPage(number);
                            setCurrentPage(number)
                        }} className="page-link">
                            {number}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationLink id="pagination_link" style={{color: "black"}} next onClick={() => handleNext()
                    }/>
                </PaginationItem>
            </Pagination>
        </nav>
    );
}

