import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import {getAvailableActivities} from "../../api/activitiesApi.ts";
import {capitalizeFirstLetter, formatLocalDateTime} from "../../utils.ts";
import {FaPlay} from "react-icons/fa";

const availableActivitiesQueryOptions = queryOptions({
  queryKey: ['activities', 'available'],
  queryFn: getAvailableActivities,
})

const ActivityContainer = () => {
  const { data: activities } = useSuspenseQuery(availableActivitiesQueryOptions)

  return (
    <div className="space-y-10">
      {activities.map((a) => (
        <div className={'space-y-2'}>
          <div key={a.id} className="bg-sunglow-300 border-3 border-sunglow-600 px-10 py-6 rounded-md text-dark-neutrals-500 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-2xl">{a.title}</h2>
              {a.description && (
                <p className="mt-1 text-dark-neutrals-400">{a.description}</p>
              )}
            </div>
            <div className="flex gap-8 ml-8 shrink-0">
              <div>
                <div className="font-bold uppercase tracking-wide text-lg text-dark-neutrals-400">Početak</div>
                <div className="mt-1 font-medium">{formatLocalDateTime(a.time_from)}</div>
              </div>
              <div>
                <div className="font-bold uppercase tracking-wide text-lg text-dark-neutrals-400">Kraj</div>
                <div className="mt-1 font-medium">{formatLocalDateTime(a.time_to)}</div>
              </div>
            </div>
          </div>

          <div className="space-y-2 flex flex-col items-end pl-10 relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-turquoise-400 rounded-full"/>
            {a.activity_tasks.map((at) => (
              <div key={at.activity_task_id} className="w-full bg-turquoise-100 border-2 border-turquoise-400 px-6 py-4 rounded-md text-dark-neutrals-500 flex items-center justify-between relative">
                <div className="absolute -left-6 top-1/2 w-6 h-0.5 bg-turquoise-400" />
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <span className="bg-turquoise-400 text-white font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                    {at.order}
                  </span>
                  <div className="min-w-0">
                    <div className="font-bold text-lg">{at.task_title}</div>
                    {at.task_description && (
                      <div className="text-sm text-dark-neutrals-400 mt-0.5">{at.task_description}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6 ml-6 shrink-0">
                  <span>
                    <span className="mr-2">Tip zadatka:</span>
                    <span className="font-bold text-dark-neutrals-400">{capitalizeFirstLetter(at.task_type)}</span>
                  </span>
                  <button className="bg-emerald-500 text-light-cyan-50 font-display font-bold text-lg px-6 py-2 rounded flex items-center gap-3 hover:cursor-pointer hover:bg-emerald-600 transition">
                    <FaPlay size={14} />
                    Započni
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityContainer;