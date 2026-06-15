import {UserStartedTask} from "../types/userStartedTasksTypes.ts";

export const getUserStartedTask = async (activityTaskId: string): Promise<UserStartedTask> => {
  const response = await fetch(`/api/user-started-tasks/activity-task/${activityTaskId}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user started task');
  }

  return response.json();
};

export const getUserStartedTaskByAssignment = async (id: string): Promise<UserStartedTask> => {
  const response = await fetch(`/api/user-started-tasks/by-assignment/${id}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user started task');
  }

  return response.json();
};

export const createUserStartedTask = async (activityTaskId?: number, assignmentId?: string, initialCode?: string) => {
  let body;
  if (activityTaskId) body = JSON.stringify({ activity_task_id: activityTaskId });
  else if (assignmentId) body = JSON.stringify({ assignment_id: assignmentId, initial_code: initialCode });
  const response = await fetch('/api/user-started-tasks/', {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create user started task');
  }

  return response.json();
};

export const updateUserStartedTask = async (ustId: number, data: { current_value: string }) => {
  const response = await fetch(`/api/user-started-tasks/${ustId}`, {
    credentials: 'include',
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update user started task');
  }

  return response.json();
};

export const finishTask = async (ustId: number) => {
  const response = await fetch(`/api/user-started-tasks/${ustId}/finish`, {
    method: "POST",
    credentials: "include",
  });
  return response.json();
};