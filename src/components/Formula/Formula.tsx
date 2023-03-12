import React from "react";
import { toast } from "react-hot-toast";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { addClause, setFormulaOpened } from "../../redux/slices/formula";
import { clearSolutions } from "../../redux/slices/solutions";
import { clearDimacs } from "../../redux/slices/panel";

import { IconButton, Pagination } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { Clause } from "./Clause/Clause";

import styles from "./Formula.module.scss";

export const Formula: React.FC = () => {
  const dispatch = useDispatch();

  const clausesPerPage = 200;
  const [page, setPage] = React.useState(0);

  const { clauses, opened } = useSelector((state: RootState) => state.formula);

  const onClickAddClause = () => {
    const input = window.prompt("Enter clause: ");

    const clause = input?.split("|").map((item) => parseInt(item));

    if (clause) {
      dispatch(addClause(clause));

      toast.success("Clause was successfully added!");

      sessionStorage.setItem("formula", "");
      dispatch(clearDimacs());
      dispatch(clearSolutions());
    }
  };

  const renderFormula = () => {
    const clausesOnPage = clauses.slice(page, page + clausesPerPage);

    if (clausesOnPage.length < clausesPerPage) {
      return clausesOnPage.map((clause, index) => (
        <li key={clause.id}>
          <Clause clause={clause} />
          {clausesOnPage.length - 1 > index && <span>&#8743;</span>}
        </li>
      ));
    } else {
      return clausesOnPage.map((clause) => (
        <li key={clause.id}>
          <Clause clause={clause} />
          <span>&#8743;</span>
        </li>
      ));
    }
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles["header__left"]}>
          <h2 onClick={() => dispatch(setFormulaOpened(!opened))}>
            {clauses.length > 0
              ? "Formula in CNF"
              : "There are no formula so far"}
          </h2>
          <svg
            className={opened ? styles["opened"] : ""}
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 5C10 5.16927 9.93815 5.31576 9.81445 5.43945C9.69075 5.56315 9.54427 5.625 9.375 5.625H0.625C0.455729 5.625 0.309245 5.56315 0.185547 5.43945C0.061849 5.31576 0 5.16927 0 5C0 4.83073 0.061849 4.68424 0.185547 4.56055L4.56055 0.185547C4.68424 0.061849 4.83073 0 5 0C5.16927 0 5.31576 0.061849 5.43945 0.185547L9.81445 4.56055C9.93815 4.68424 10 4.83073 10 5Z"
              fill="#2C2C2C"
            />
          </svg>
        </div>
        {opened && (
          <IconButton color="primary" onClick={onClickAddClause}>
            <AddIcon color="primary" />
          </IconButton>
        )}
      </div>
      {opened && (
        <>
          <div className={styles["formula-container"]}>
            {clauses.length > 0 ? (
              <ul className={styles.formula}>{renderFormula()}</ul>
            ) : (
              <div className={styles["no-formula"]}>
                <span>😪😪😪</span>
              </div>
            )}
          </div>
          {clauses.length > clausesPerPage && (
            <Pagination
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
              color="primary"
              onChange={(_, value: number) =>
                setPage((value - 1) * clausesPerPage)
              }
              count={Math.ceil(clauses.length / clausesPerPage)}
            />
          )}
        </>
      )}
    </>
  );
};
