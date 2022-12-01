import React, { useRef, useState } from "react";

import { Autocomplete, Icon, IconButton, Popover, TextField } from "@mui/material";
import { useSnapshot } from "valtio";

import { Project, ProjectImageType } from "../../../types/Project";
import { state } from "../PortfolioView";

export const ProjectNavigator: React.FC = () => {
  const autoCompleteRef = useRef(null);

  const snap = useSnapshot(state);

  const changeView = (view: "horizontal" | "grid") => {
    state.currentProject = null;
    state.currentView = view;
  };
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const filterProjects = (options: Project[], { inputValue }: any) => {
    const projects = options.filter(
      item =>
        item.title.includes(inputValue) ||
        item.keywords.filter(keyword => keyword.toLowerCase().includes(inputValue.toLowerCase())).length > 0,
    );

    return projects;
  };

  const changeProject = (e: React.SyntheticEvent<Element, Event>, val: Project | null) => {
    if (val) {
      const projects = JSON.parse(JSON.stringify(snap.allProjects)) as ProjectImageType[];

      const [project] = projects.filter(proj => proj.id === val.uuid);
      if (project) {
        state.currentProject = JSON.parse(JSON.stringify(project));
      }
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        top: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 8,
        marginTop: 8,
        paddingRight: 8,
      }}>
      <IconButton component="button" size="small" color="primary" onClick={(e: any) => handleClick(e)}>
        <Icon>search_icon</Icon>
      </IconButton>
      <IconButton
        component="button"
        size="small"
        color="primary"
        onClick={() => {
          changeView("horizontal");
        }}>
        <Icon>view_column</Icon>
      </IconButton>
      <IconButton component="button" size="small" color="primary" onClick={() => changeView("grid")}>
        <Icon>view_comfy</Icon>
      </IconButton>

      <Popover
        marginThreshold={8}
        id={id}
        open={open}
        anchorReference="anchorPosition"
        anchorPosition={{ top: 100, left: typeof window !== "undefined" ? window?.innerWidth : 0 }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onClose={handleClose}>
        {snap.projectsData && (
          <Autocomplete
            onChange={changeProject}
            ref={autoCompleteRef}
            filterOptions={filterProjects}
            getOptionLabel={(opt: Project) => opt.title}
            sx={{ width: 400 }}
            size="small"
            options={snap.projectsData as Project[]}
            renderInput={params => (
              <TextField
                {...params}
                onFocus={() => (state.isSearchFocused = true)}
                onBlur={() => (state.isSearchFocused = false)}
                placeholder="Search for projects, libraries or techniques"
              />
            )}></Autocomplete>
        )}
      </Popover>
    </div>
  );
};
