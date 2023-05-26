import { Detail } from '@raycast/api';
import { Task } from '../types/types';

const Modify = (props: { task: Task }) => {
  const { task } = props;

  return (
    <>
      <Detail markdown={`# hello ${task.description}`} />
    </>
  );
};

export default Modify;
