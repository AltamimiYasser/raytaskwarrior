import { Detail } from "@raycast/api";
import { Task } from "../types/types";

const Details = (props: { task: Task }) => {
  const { task: task } = props;
  return (
    <>
      <Detail markdown={`# ${task.description}`} />
    </>
  );
};

export default Details;
