import { useState, FormEvent } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Activity, CreateActivityRequest } from '../../types/activityTypes.ts';

type ActivityFormProps = {
  activity?: Activity;
  onSubmit: (data: CreateActivityRequest) => Promise<void>;
  isLoading: boolean;
  error?: string;
  cancelTo?: string;
};

export function ActivityForm({ activity, onSubmit, isLoading, error, cancelTo }: ActivityFormProps) {
  const navigate = useNavigate();
  const isEditing = !!activity;

  const [formData, setFormData] = useState<CreateActivityRequest>({
    title: activity?.title || '',
    description: activity?.description || '',
    time_from: activity?.time_from?.slice(0, 16) || '',
    time_to: activity?.time_to?.slice(0, 16) || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.time_from) {
      newErrors.time_from = 'Start time is required';
    }
    if (!formData.time_to) {
      newErrors.time_to = 'End time is required';
    }
    if (formData.time_from && formData.time_to && formData.time_from >= formData.time_to) {
      newErrors.time_to = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onSubmit(formData);
  };

  const handleChange = (field: keyof CreateActivityRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Activity title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            id="description"
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Optional description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="time_from" className="block text-sm font-medium mb-1">Start Time *</label>
            <input
              type="datetime-local"
              id="time_from"
              value={formData.time_from}
              onChange={(e) => handleChange('time_from', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${errors.time_from ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.time_from && <p className="mt-1 text-sm text-red-600">{errors.time_from}</p>}
          </div>

          <div>
            <label htmlFor="time_to" className="block text-sm font-medium mb-1">End Time *</label>
            <input
              type="datetime-local"
              id="time_to"
              value={formData.time_to}
              onChange={(e) => handleChange('time_to', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md ${errors.time_to ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.time_to && <p className="mt-1 text-sm text-red-600">{errors.time_to}</p>}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : isEditing ? 'Update Activity' : 'Create Activity'}
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: cancelTo || '/admin/activities' })}
          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-md font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}