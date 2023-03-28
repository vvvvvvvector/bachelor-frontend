import React from "react";
import toast from "react-hot-toast";

import axiosInstance from "../../../../axios";

import { useSelector, useDispatch } from "react-redux";
import { setNextSolution } from "../../../../redux/slices/solutions";
import { buttonStyle } from "../../../../shared/mui";
import { RootState } from "../../../../redux/store";

import { Button } from "@mui/material";
import ForwardOutlinedIcon from "@mui/icons-material/ForwardOutlined";

export const Next: React.FC<{ solver: string }> = ({ solver }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = React.useState(false);

  const { solutions } = useSelector((state: RootState) => state.solutions);
  const { dimacs, errors } = useSelector((state: RootState) => state.editor);

  const onClickNext = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.post("next-solution", {
        solver,
        formula: sessionStorage.getItem("formula"),
      });

      setLoading(false);

      if (response.data.satisfiable) {
        sessionStorage.setItem(
          "formula",
          JSON.stringify(response.data.clauses)
        );

        dispatch(setNextSolution(response.data.next_solution));

        toast.success("Next solution was successfully found!");
      } else {
        toast.error("There are no more solutions!");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong!");
      console.error("Something went wrong!", error);
    }
  };

  return (
    <Button
      sx={buttonStyle}
      onClick={onClickNext}
      disabled={
        loading || dimacs === "" || solutions.length === 0 || errors.length > 0
      }
      endIcon={<ForwardOutlinedIcon />}
      variant="contained"
    >
      {loading ? "Finding..." : "Next solution"}
    </Button>
  );
};