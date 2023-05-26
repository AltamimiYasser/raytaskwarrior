import { useState } from 'react';
import { Action, ActionPanel, Form, popToRoot, showToast, Toast } from '@raycast/api';
import { Task } from '../types/types';
import { modifyTask } from '../api';

interface FormValues {
  description?: string;
  project?: string;
  tags?: string[];
}

const Modify = (props: { task: Task }) => {
  const { task } = props;

  const [descriptionError, setdescriptionError] = useState<string | undefined>();

  const dropDescriptionErrorIfNeeded = () => {
    if (descriptionError && descriptionError.length > 0) {
      setdescriptionError(undefined);
    }
  };

  const onSubmit = ({ description, project, tags }: FormValues) => {
    modifyTask(task.uuid, description, project, tags);

    showToast({
      title: 'Modified Task successfully',
      style: Toast.Style.Success,
    });
    popToRoot();
  };

  return (
    <>
      <Form
        actions={
          <ActionPanel>
            <Action.SubmitForm onSubmit={onSubmit} />
          </ActionPanel>
        }
      >
        <Form.TextField
          id='description'
          title='Description'
          placeholder='task description'
          defaultValue={task.description}
          error={descriptionError}
          onChange={dropDescriptionErrorIfNeeded}
          onBlur={(event) => {
            if (event.target.value?.length == 0) {
              setdescriptionError('A task must at least have a description.');
            } else {
              dropDescriptionErrorIfNeeded();
            }
          }}
        />
        <Form.TextField
          id='project'
          title='Project'
          placeholder='project'
          defaultValue={task.project ? task.project : ''}
          info='leave empty to delete or not add a new project'
        />
      </Form>
    </>
  );
};

export default Modify;

// TODO: To Modify:
// description
// Tags: comma saparated -> needs fixing from the API to the modification and the adding
// project -> pass - to remove a project
// priority
// Due: just like in Task warrior format
