import { List } from "@raycast/api";

// TODO: make it generic so we can filter by project and tag
//
const ProjectsDropdown = (props: {
  projects: Set<string>;
  onProjectChange: (newValue: string) => void;
  isLoading: boolean;
}) => {
  const { projects: projects, onProjectChange: onProjectChange, isLoading: isLoading } = props;
  return (
    <List.Dropdown
      tooltip="Select Project"
      storeValue={true}
      filtering={false}
      defaultValue={"All"}
      isLoading={isLoading}
      onChange={(newValue) => {
        onProjectChange(newValue);
      }}
    >
      {Array.from(projects).map((project) => (
        <List.Dropdown.Item key={project} title={project} value={project} />
      ))}
      <List.Dropdown.Section title="Projects"></List.Dropdown.Section>
    </List.Dropdown>
  );
};

export default ProjectsDropdown;
