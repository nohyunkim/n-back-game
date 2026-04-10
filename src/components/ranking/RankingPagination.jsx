const getVisiblePages = ({ currentPage, totalPages, windowSize }) => {
  const halfWindow = Math.floor(windowSize / 2);
  let startPage = Math.max(currentPage - halfWindow, 1);
  let endPage = Math.min(startPage + windowSize - 1, totalPages);

  if (endPage - startPage + 1 < windowSize) {
    startPage = Math.max(endPage - windowSize + 1, 1);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
};

export default function RankingPagination({ currentPage, totalPages, onPageChange, styles }) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages({
    currentPage,
    totalPages,
    windowSize: 5,
  });

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        className={styles.pageButton}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        이전
      </button>

      <div className={styles.pageNumbers}>
        {visiblePages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={`${styles.pageButton} ${currentPage === pageNumber ? styles.pageButtonActive : ""}`}
            onClick={() => onPageChange(pageNumber)}
            aria-current={currentPage === pageNumber ? "page" : undefined}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      <button
        type="button"
        className={styles.pageButton}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        다음
      </button>
    </div>
  );
}
