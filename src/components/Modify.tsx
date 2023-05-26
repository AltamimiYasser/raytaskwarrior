import { useState } from 'react';
import { Action, ActionPanel, Form, popToRoot, showToast, Toast } from '@raycast/api';
import { Task } from '../types/types';
import { modifyTask } from '../api';

interface FormValues {
  description?: string;
  project?: string;
  tags?: string;
}

const Modify = (props: { task: Task }) => {
  const { task } = props;

  const [descriptionError, setdescriptionError] = useState<string | undefined>();
  const [tagsError, setTagsError] = useState<string | undefined>();

  const dropDescriptionErrorIfNeeded = () => {
    if (descriptionError && descriptionError.length > 0) {
      setdescriptionError(undefined);
    }
  };

  const dropTagsErrorIfNeeded = () => {
    if (tagsError && tagsError.length > 0) {
      setTagsError(undefined);
    }
  };

  const isFormValid = (description?: string, tags?: string) => {
    let isValid = true;

    if (!description || description.trim().length === 0) {
      setdescriptionError('A task must at least have a description.');
      isValid = false;
    }

    if (tags && tags.includes(' ')) {
      setTagsError('spaces are not allowed. format: tag1,tag2,tag3');
      isValid = false;
    }

    return isValid;
  };

  const onSubmit = ({ description, project, tags }: FormValues) => {
    if (!isFormValid(description, tags)) {
      return;
    }

    const tagsArray = tags?.split(',');
    modifyTask(task.uuid, description, project, tagsArray);

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
          key='description'
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
          key='project'
          title='Project'
          placeholder='project name'
          defaultValue={task.project ? task.project : ''}
          info='leave empty to delete or not add a new project'
        />
        <Form.TextField
          id='tags'
          title='Tags'
          placeholder='tag1,tag2,tag3'
          defaultValue={task.tags ? Array.from(task.tags).join(',') : ''}
          info='add comma saparated list of tags. +tag to add and -tag to remove'
          error={tagsError}
          onChange={dropTagsErrorIfNeeded}
          onBlur={(event) => {
            if (event.target.value?.includes(' ')) {
              setTagsError('spaces are not allowed. format: tag1,tag2,tag3');
            } else {
              dropTagsErrorIfNeeded();
            }
          }}
        />
      </Form>
    </>
  );
};

export default Modify;

// TODO: To Modify:
// Tags: comma saparated -> needs fixing from the API to the modification and the adding
// priority
// Due: just like in Task warrior format
