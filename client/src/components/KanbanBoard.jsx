import React from 'react';
import { TaskCard } from './TaskCard';
import { KANBAN_COLUMNS } from '../utils/constants';
import { Plus } from 'lucide-react';

export const KanbanBoard = ({ tasks = [], onTaskClick, onTaskStatusChange, onAddTaskClick }) => {
  const getTasksForColumn = (columnId) => {
    return tasks.filter((t) => t.status === columnId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onTaskStatusChange(taskId, targetColumnId);
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  return (
    <div className="kanban-grid">
      {KANBAN_COLUMNS.map((col) => {
        const columnTasks = getTasksForColumn(col.id);

        return (
          <div
            key={col.id}
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            {/* Column Header */}
            <div className="column-header">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: col.color }}
                ></span>
                <h3 className="column-title">{col.title}</h3>
                <span className="column-count">{columnTasks.length}</span>
              </div>

              {onAddTaskClick && (
                <button
                  onClick={() => onAddTaskClick(col.id)}
                  className="btn-icon text-gray-400 hover:text-indigo-600"
                  title={`Add task to ${col.title}`}
                >
                  <Plus size={16} />
                </button>
              )}
            </div>

            {/* Tasks Container */}
            <div className="column-body">
              {columnTasks.length === 0 ? (
                <div className="empty-column-placeholder">
                  <p className="text-xs text-gray-400 font-medium">No tasks in {col.title}</p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task._id)}
                  >
                    <TaskCard
                      task={task}
                      onClick={onTaskClick}
                      onStatusChange={onTaskStatusChange}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}

      <style>{`
        .kanban-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1.25rem;
          align-items: start;
        }
        @media (max-width: 1024px) {
          .kanban-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 640px) {
          .kanban-grid {
            grid-template-columns: 1fr;
          }
        }
        .kanban-column {
          background-color: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-xl);
          padding: 1rem;
          min-height: 520px;
          display: flex;
          flex-direction: column;
        }
        .column-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-color);
        }
        .column-title {
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .column-count {
          background-color: var(--bg-card);
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
        }
        .column-body {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          flex: 1;
          overflow-y: auto;
        }
        .empty-column-placeholder {
          height: 120px;
          border: 2px dashed var(--border-color);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
      `}</style>
    </div>
  );
};
