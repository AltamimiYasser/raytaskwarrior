import { Detail } from "@raycast/api";
import { Task } from "../types/types";
import { formatDate } from "../utils/dateFormatters";

const Details = (props: { task: Task }) => {
  const { task: task } = props;
  // TODO: add actions
  return (
    <>
      <Detail
        navigationTitle={task.description}
        markdown={`# ${task.description}`}
        metadata={
          <Detail.Metadata>
            {task.start ? <Detail.Metadata.Label title={`Started: ${formatDate(task.start)}`} /> : ""}
          </Detail.Metadata>
        }
      />
    </>
  );
};

export default Details;
