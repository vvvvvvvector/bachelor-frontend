import React from "react";
import toast from "react-hot-toast";

import { Variable } from "../index";

import styles from "./Clause.module.scss";

type ClauseType = {
  clause: {
    id: number;
    variables: number[];
  };
};

export const Clause: React.FC<ClauseType> = ({ clause }) => {
  const onClickClause = () => {
    toast(
      (t) => (
        <span>
          {`clause id: ${clause.id}`}
          <button
            style={{ marginLeft: "10px" }}
            onClick={() => toast.dismiss(t.id)}
          >
            Dismiss
          </button>
        </span>
      ),
      { icon: "🛠️" }
    );
  };

  return (
    <ul className={styles.clause} onClick={onClickClause}>
      <p>(</p>
      {clause.variables.map((i, index) => (
        <li key={index}>
          <Variable variable={{ id: index, index: i, clauseId: clause.id }} />
          {clause.variables.length - 1 > index && <span>&#8744;</span>}
        </li>
      ))}
      <p>)</p>
    </ul>
  );
};
