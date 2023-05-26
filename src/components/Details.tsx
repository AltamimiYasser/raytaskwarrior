import { useMemo } from 'react';
import { Action, ActionPanel, Color, Detail } from '@raycast/api';
import { Priority, Task } from '../types/types';
import { formatDate, formatDueDate, getActiveTime } from '../utils/dateFormatters';
import Modify from './Modify';

const getRandomColor = (availableColors: Color[]): Color => {
  const randomIndex = Math.floor(Math.random() * availableColors.length);
  return availableColors[randomIndex];
};

const Details = (props: { task: Task }) => {
  const { task } = props;

  const initialColors = (Object.values(Color) as Color[]).filter(
    (color) => color !== Color.PrimaryText && color !== Color.SecondaryText
  );

  const assignRandomColorsToTags = (tags: string[]): Map<string, Color> => {
    const tagColorMap = new Map<string, Color>();
    const availableColors = [...initialColors];

    tags.forEach((tag) => {
      if (availableColors.length === 0) {
        availableColors.push(...initialColors); // Regenerate available colors
      }

      const randomColor = getRandomColor(availableColors);
      tagColorMap.set(tag, randomColor);

      // Remove the used color
      const index = availableColors.indexOf(randomColor);
      availableColors.splice(index, 1);
    });

    return tagColorMap;
  };

  const markdown = useMemo(() => {
    let md = `
## description:  
${task.description}  
## Status:  
${task.status}   
`;

    if (task.project) {
      md += `
## project:  
${task.project}  
`;
    }

    if (task.priority) {
      md += `
## Priority:  
${task.priority === Priority.H ? 'Hi' : task.priority === Priority.M ? 'Medium' : 'Low'}
`;
    }

    if (task.due) {
      md += `
## Due:  
${formatDueDate(task.due)}
`;
    }

    return md;
  }, []);

  const tagColorMap = useMemo(() => assignRandomColorsToTags(task.tags || []), [task.tags]);

  // TODO: add actions
  return (
    <>
      <Detail
        navigationTitle={task.description}
        markdown={markdown}
        actions={
          <ActionPanel>
            <Action.Push title='Modify' target={<Modify task={task} />} />
          </ActionPanel>
        }
        metadata={
          <Detail.Metadata>
            {task.entry ? (
              <Detail.Metadata.Label title='Added on:' text={formatDate(task.entry)} />
            ) : (
              ''
            )}
            {task.start ? (
              <Detail.Metadata.Label title='Active for:' text={getActiveTime(task.start)} />
            ) : (
              ''
            )}
            {task.modified ? (
              <Detail.Metadata.Label title='Modified on:' text={formatDate(task.modified)} />
            ) : (
              ''
            )}
            {task.tags ? (
              <Detail.Metadata.TagList title='tags'>
                {task.tags.map((tag) => {
                  return (
                    <Detail.Metadata.TagList.Item
                      text={tag}
                      color={tagColorMap.get(tag) || Color.Blue}
                    />
                  );
                })}
              </Detail.Metadata.TagList>
            ) : (
              ''
            )}
            <Detail.Metadata.Label title='Urgency:' text={task.urgency.toLocaleString()} />
          </Detail.Metadata>
        }
      />
    </>
  );
};

export default Details;
