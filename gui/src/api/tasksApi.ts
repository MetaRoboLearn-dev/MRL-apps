export const getTasksPreview = async (params: {
  skip?: number;
  limit?: number;
  active_only?: boolean;
  search?: string;
  order_by_title?: boolean;
}) => {
  const queryParams = new URLSearchParams();

  if (params.skip) queryParams.set('skip', params.skip.toString());
  if (params.limit) queryParams.set('limit', params.limit.toString());
  if (params.active_only !== undefined) queryParams.set('active_only', params.active_only.toString());
  if (params.search) queryParams.set('search', params.search);
  if (params.order_by_title) queryParams.set('order_by_username', params.order_by_title.toString());

  const response = await fetch(`/api/tasks/?${queryParams}`);
  return response.json();
}

export const getTaskById = async (taskId: string)=>{
  const response = await fetch(`/api/tasks/${taskId}`)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Task not found')
    }
    throw new Error('Failed to fetch task')
  }

  return response.json()
}